using System.Collections.Generic;
using WebAtividadeEntrevista.Models;

namespace FI.WebAtividadeEntrevista.Validação
{
    public class Validacao
    {
        public static bool ValidarCPFBeneficiario(List<BeneficiarioModel> beneficiarioModels, string ClienteCpf) 
        {
            foreach (BeneficiarioModel beneficiarioModel in beneficiarioModels)
            {
                if (beneficiarioModel.CPF == ClienteCpf)
                    return true;
            }

            return false;
        }
    }
}