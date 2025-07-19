function validarCPF(cpf) {
    cpf = cpf ? cpf.replace(/\D/g, '') : '';
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    var soma = 0, resto;
    for (var i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (var i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

function formatarCPF(cpf) {
    cpf = cpf ? cpf.replace(/\D/g, '') : '';
    if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

function removerMascaraCPF(cpf) {
    return cpf ? cpf.replace(/\D/g, '') : '';
}

$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(formatarCPF(obj.CPF));
    }
    $('#formCadastro #CPF').on('input', function () {
        var cursor = this.selectionStart;
        var originalLength = this.value.length;
        this.value = formatarCPF(this.value);
        var newLength = this.value.length;
        this.selectionEnd = cursor + (newLength - originalLength);
    });

    $('#formCadastro').submit(function (e) {
        var $form = $(this);
        var cpfLimpo = removerMascaraCPF($form.find('#CPF').val());
        if (!validarCPF(cpfLimpo)) {
            ModalDialog("CPF Inválido", "Por favor, informe um CPF válido.");
            $form.find('#CPF').focus();
            e.preventDefault();
            return false;
        }
        e.preventDefault();

        var idCliente = (typeof obj !== 'undefined' && obj && obj.Id) ? obj.Id : $form.find('#Id').val();

        $.ajax({
            url: '/Cliente/CpfExiste',
            method: 'POST',
            data: { cpf: cpfLimpo, id: idCliente },
            success: function (result) {
                if (result.existe) {
                    ModalDialog("CPF Existente", "Já existe um cliente cadastrado com este CPF.");
                    $form.find('#CPF').focus();
                    return false;
                }

                $form.find('#CPF').val(cpfLimpo);
                var formData = new FormData();
                formData.append("Id", idCliente);
                formData.append("NOME", $form.find("#Nome").val());
                formData.append("CEP", $form.find("#CEP").val());
                formData.append("Email", $form.find("#Email").val());
                formData.append("Sobrenome", $form.find("#Sobrenome").val());
                formData.append("Nacionalidade", $form.find("#Nacionalidade").val());
                formData.append("Estado", $form.find("#Estado").val());
                formData.append("Cidade", $form.find("#Cidade").val());
                formData.append("Logradouro", $form.find("#Logradouro").val());
                formData.append("Telefone", $form.find("#Telefone").val());
                formData.append("CPF", cpfLimpo);

                if (typeof beneficiarios !== 'undefined' && beneficiarios.length > 0) {
                    for (var i = 0; i < beneficiarios.length; i++) {
                        formData.append('Beneficiarios[' + i + '].Nome', beneficiarios[i].Nome);
                        formData.append('Beneficiarios[' + i + '].CPF', beneficiarios[i].CPF);
                    }
                }

                $.ajax({
                    url: urlPost,
                    method: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                    success:
                    function (r) {
                        ModalDialog("Sucesso!", r)
                        $("#formCadastro")[0].reset();                                
                        window.location.href = urlRetorno;
                    }
                });
                setTimeout(function () {
                    $form.find('#CPF').val(formatarCPF($form.find('#CPF').val()));
                }, 100);
            }
        });
    });
});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                            ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
