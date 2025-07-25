var beneficiarios = [];
var beneficiarioEditando = null;
var beneficiariosExistentes = [];
var beneficiariosExcluidos = [];
$(document).ready(function () {
    $('#modalBeneficiarios').on('show.bs.modal', function () {
        limparCamposBeneficiario();
        var clienteId = (typeof obj !== 'undefined' && obj)
            ? obj.Id
            : null;

        if (!clienteId) {
            renderizarGridBeneficiarios();
        } else if (beneficiarios.length === 0) {
            $.ajax({
                url: '/Cliente/ObterBeneficiarios',
                method: 'GET',
                data: { idCliente: clienteId },
                success: function (result) {
                    beneficiarios = result.filter(function (b) {
                        return !beneficiariosExcluidos.some(function (excluido) {
                            return excluido.CPF === b.CPF;
                        });
                    });
                    beneficiariosExistentes = beneficiarios.map(function (b) {
                        return {
                            id: b.Id,
                            cpf: b.CPF,
                            nome: b.Nome
                        };
                    });
                    renderizarGridBeneficiarios();
                },
                error: function (xhr, status, error) {
                    ModalDialog("Erro", "Não foi possível carregar os beneficiários.");
                }
            });
        }
        $('#BeneficiarioCPF').val('');
        $('#BeneficiarioNome').val('');
        beneficiarioEditando = null;
    });

    $('#modalBeneficiarios').on('hidden.bs.modal', function () {
        $('#BeneficiarioCPF').val('');
        $('#BeneficiarioNome').val('');
        beneficiarioEditando = null;
    });

    $('#BeneficiarioCPF').on('input', function () {
        var cursor = this.selectionStart;
        var originalLength = this.value.length;
        this.value = formatarCPF(this.value);
        var newLength = this.value.length;
        this.selectionEnd = cursor + (newLength - originalLength);
    });

    function limparCampos() {
        $('#BeneficiarioCPF, #BeneficiarioNome').val('');
        window.beneficiarioEditando = null;
    }

    $('#modalBeneficiarios').on('shown.bs.modal', function () {
        limparCampos();
    });

    $('#modalBeneficiarios').on('hidden.bs.modal', function () {
        limparCampos();
        limparCamposBeneficiario();
        if (window.beneficiarios.length === 0) {
            $("#gridBeneficiarios tbody").empty();
        }
    });

    $('#btnIncluirBeneficiario').click(function () {
        var cpf = removerMascaraCPF($('#BeneficiarioCPF').val());
        var nome = $('#BeneficiarioNome').val().trim();
        var cpfCliente = '';

        if ($('#CPF').length) {
            cpfCliente = removerMascaraCPF($('#CPF').val());
        }
        if (!validarCPF(cpf)) {
            ModalDialog("CPF do beneficiário Inválido", "Por favor, informe um CPF válido.");
            return;
        }
        if (!nome) {
            ModalDialog("Nome do beneficiário inválido", "Por favor, informe o nome do beneficiário.");
            return;
        }

        if (cpfCliente && cpf === cpfCliente) {
            ModalDialog("CPF do beneficiário Inválido", "O CPF do beneficiário não pode ser igual ao CPF do cliente!");
            return;
        }

        var idxDuplicado = beneficiarios.findIndex(function (b, idx) {
            return b.CPF === cpf && (beneficiarioEditando === null || idx !== beneficiarioEditando);
        });
        if (idxDuplicado !== -1) {
            ModalDialog("CPF do beneficiário Inválido", "Já existe um beneficiário com este CPF!");
            return;
        }
        if (beneficiarioEditando !== null) {
            beneficiarios[beneficiarioEditando] = { CPF: cpf, Nome: nome };
            beneficiarioEditando = null;
        } else {
            beneficiarios.push({ CPF: cpf, Nome: nome });
        }
        limparCampos();
        renderizarGridBeneficiarios();
    });

    $('#gridBeneficiarios').on('click', '.btnAlterarBeneficiario', function () {
        var idx = $(this).data('idx');
        var b = beneficiarios[idx];
        $('#BeneficiarioCPF').val(formatarCPF(b.CPF));
        $('#BeneficiarioNome').val(b.Nome);
        beneficiarioEditando = idx;
    });

    var idxParaExcluir = null;
    $('#gridBeneficiarios').on('click', '.btnExcluirBeneficiario', function () {
        idxParaExcluir = $(this).data('idx');
        $('#modalConfirmaExclusaoBeneficiario').modal('show');
    });

    $('#btnConfirmaExclusaoBeneficiario').on('click', function () {
        if (idxParaExcluir !== null) {
            beneficiariosExcluidos.push(beneficiarios[idxParaExcluir]);
            beneficiarios.splice(idxParaExcluir, 1);
            renderizarGridBeneficiarios();
            idxParaExcluir = null;
            limparCamposBeneficiario();
        }
        $('#modalConfirmaExclusaoBeneficiario').modal('hide');
    });

});

function limparCamposBeneficiario() {
    $('#BeneficiarioCPF').val('');
    $('#BeneficiarioNome').val('');
    beneficiarioEditando = null;
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

function renderizarGridBeneficiarios() {
    var $tbody = $('#gridBeneficiarios tbody');
    $tbody.empty();
    beneficiarios.forEach(function (b, idx) {
        var row = '<tr>' +
            '<td>' + formatarCPF(b.CPF) + '</td>' +
            '<td>' + b.Nome + '</td>' +
            '<td>' +
            '<button type="button" class="btn btn-primary btn-xs btnAlterarBeneficiario" data-idx="' + idx + '">Alterar</button> ' +
            '<button type="button" class="btn btn-primary btn-xs btnExcluirBeneficiario" data-idx="' + idx + '">Excluir</button>' +
            '</td>' +
            '</tr>';
        $tbody.append(row);
    });
}