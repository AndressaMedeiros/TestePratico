CREATE OR ALTER PROCEDURE FI_SP_PesqCliente
    @iniciarEm INT,
    @quantidade INT,
    @campoOrdenacao VARCHAR(200),
    @crescente BIT
AS
BEGIN
    DECLARE @SCRIPT NVARCHAR(MAX)
    DECLARE @CAMPOS NVARCHAR(MAX)
    DECLARE @ORDER VARCHAR(50)

    IF (@campoOrdenacao = 'EMAIL')
        SET @ORDER = 'EMAIL'
    ELSE
        SET @ORDER = 'NOME'

    IF (@crescente = 0)
        SET @ORDER = @ORDER + ' DESC'
    ELSE
        SET @ORDER = @ORDER + ' ASC'

    SET @CAMPOS = N'@iniciarEm INT, @quantidade INT'

    SET @SCRIPT = '
        SELECT ID, NOME, SOBRENOME, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE, CPF
        FROM (
            SELECT ROW_NUMBER() OVER (ORDER BY ' + @ORDER + ') AS Row,
                   ID, NOME, SOBRENOME, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE, CPF
            FROM CLIENTES WITH(NOLOCK)
        ) AS ClientesWithRowNumbers
        WHERE Row > @iniciarEm AND Row <= (@iniciarEm + @quantidade)
        ORDER BY ' + @ORDER

    EXEC SP_EXECUTESQL @SCRIPT, @CAMPOS, @iniciarEm = @iniciarEm, @quantidade = @quantidade

    SELECT COUNT(1) AS Total FROM CLIENTES WITH(NOLOCK)
END
GO
