using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                model.Id = bo.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                if (model.Beneficiarios != null && model.Beneficiarios.Count > 0)
                {
                    foreach (var b in model.Beneficiarios)
                    {
                        var beneficiarioDml = new Beneficiario
                        {
                            IdCliente = model.Id,
                            Nome = b.Nome,
                            CPF = b.CPF
                        };
                        new BoBeneficiario().Incluir(beneficiarioDml);
                    }
                }

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                if (model.Beneficiarios != null && model.Beneficiarios.Count > 0)
                {
                    var boBeneficiario = new BoBeneficiario();
                    var beneficiariosAtuais = boBeneficiario.Listar(model.Id);

                    foreach (var b in model.Beneficiarios)
                    {
                        var beneficiarioExistente = beneficiariosAtuais.FirstOrDefault(ba => ba.CPF == b.CPF);
                        var beneficiarioDml = new Beneficiario
                        {
                            Id = beneficiarioExistente?.Id ?? 0,
                            IdCliente = model.Id,
                            Nome = b.Nome,
                            CPF = b.CPF
                        };

                        if (beneficiarioExistente != null)
                            boBeneficiario.Alterar(beneficiarioDml);
                        else
                            boBeneficiario.Incluir(beneficiarioDml);
                    }

                    var cpfsAtualizados = model.Beneficiarios.Select(b => b.CPF).ToList();
                    var beneficiariosParaRemover = beneficiariosAtuais.Where(ba => !cpfsAtualizados.Contains(ba.CPF));
                    
                    foreach (var beneficiario in beneficiariosParaRemover)
                    {
                        boBeneficiario.ExcluirBeneficiario(beneficiario.Id);
                    }
                }
                               
                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF
                };

                var boBeneficiario = new BoBeneficiario();
                var beneficiarios = boBeneficiario.Listar(cliente.Id);
                model.Beneficiarios = beneficiarios.Select(b => new BeneficiarioModel
                {
                    Id = b.Id,
                    Nome = b.Nome,
                    CPF = b.CPF
                }).ToList();
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult CpfExiste(string cpf, long? id = null)
        {
            BoCliente bo = new BoCliente();

            cpf = string.IsNullOrEmpty(cpf) ? "" : new string(cpf.Where(char.IsDigit).ToArray());
            bool existe = bo.CpfExiste(cpf, id);
            return Json(new { existe = existe });
        }

        [HttpGet]
        public JsonResult ObterBeneficiarios(long idCliente)
        {
            var bo = new BoBeneficiario();
            var beneficiarios = bo.Listar(idCliente);
            return Json(beneficiarios.Select(b => new { Nome = b.Nome, CPF = b.CPF, Id = b.Id }), JsonRequestBehavior.AllowGet);
        }
    }
}