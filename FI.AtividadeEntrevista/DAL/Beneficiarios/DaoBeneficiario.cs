using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal long Incluir(Beneficiario beneficiario)
        {
            var parametros = new List<System.Data.SqlClient.SqlParameter>();
            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente));
            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));

            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        internal List<Beneficiario> Listar(long idCliente)
        {
            var parametros = new List<SqlParameter>();
            parametros.Add(new SqlParameter("IdCliente", idCliente));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<Beneficiario> beneficiarios = new List<Beneficiario>();
            if (ds.Tables[0].Rows.Count > 0)
            {
                beneficiarios.AddRange(from DataRow row in ds.Tables[0].Rows
                                     select new Beneficiario
                                     {
                                         Id = row.Field<long>("Id"),
                                         IdCliente = row.Field<long>("IdCliente"),
                                         Nome = row.Field<string>("Nome"),
                                         CPF = row.Field<string>("CPF")
                                     });
            }
            return beneficiarios;
        }

        internal void DesassociarCliente(long id)
        {
            var parametros = new List<SqlParameter>();
            parametros.Add(new SqlParameter("Id", id));

            base.Executar("FI_SP_DesassociaBeneficiario", parametros);
        }
    }
}
