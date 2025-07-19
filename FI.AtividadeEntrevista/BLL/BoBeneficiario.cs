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

        public void DesassociarCliente(long id)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            dao.DesassociarCliente(id);
        }
    }
}
