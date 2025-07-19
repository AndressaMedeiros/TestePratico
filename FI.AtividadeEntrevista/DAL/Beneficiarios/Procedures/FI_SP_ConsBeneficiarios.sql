CREATE PROCEDURE FI_SP_ConsBeneficiarios
    @IdCliente BIGINT
AS
BEGIN
    SELECT Id, IdCliente, Nome, CPF
    FROM BENEFICIARIOS
    WHERE IdCliente = @IdCliente
END
GO