using FI.AtividadeEntrevista.DML;
using FI.AtividadeEntrevista.DAL;
using System.Collections.Generic;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public long Incluir(Beneficiario beneficiario)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            return dao.Incluir(beneficiario);
        }

        public List<Beneficiario> Listar(long idCliente)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            return dao.Listar(idCliente);
        }

        public void ExcluirBeneficiario(long id)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            dao.ExcluirBeneficiario(id);
        }

        public void Alterar(Beneficiario beneficiario)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            dao.Alterar(beneficiario);
        }
    }
}
