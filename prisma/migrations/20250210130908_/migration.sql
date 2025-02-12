BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'ROLE_USER',
    [password] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[DatosOrdenes] (
    [Orden] VARCHAR(15) NOT NULL,
    [Producto] VARCHAR(15) NOT NULL,
    [Descripcion] VARCHAR(30) NOT NULL,
    [Maquina] VARCHAR(15) NOT NULL,
    [PiezasTot] INT NOT NULL,
    [TCicloTeo] FLOAT(53) NOT NULL,
    [Estado] VARCHAR(15) NOT NULL,
    CONSTRAINT [DatosOrdenes_pkey] PRIMARY KEY CLUSTERED ([Orden])
);

-- CreateTable
CREATE TABLE [dbo].[EstadoMaquinas] (
    [Maqunia] VARCHAR(15) NOT NULL,
    [Orden] VARCHAR(15) NOT NULL,
    [Producto] VARCHAR(15) NOT NULL,
    [Estado] VARCHAR(15) NOT NULL,
    [Fechalnicio] DATETIME2 NOT NULL,
    [CodParo] VARCHAR(10) NOT NULL,
    [Tipo] VARCHAR(1) NOT NULL,
    [Piezas] INT NOT NULL,
    [TurnoActual] VARCHAR(15) NOT NULL,
    [FechalniTurno] DATETIME2 NOT NULL,
    [FechaFinTurno] DATETIME2 NOT NULL,
    CONSTRAINT [EstadoMaquinas_pkey] PRIMARY KEY CLUSTERED ([Maqunia])
);

-- CreateTable
CREATE TABLE [dbo].[CodigosScrap] (
    [Codigo] VARCHAR(10) NOT NULL,
    [Descripcion] VARCHAR(30) NOT NULL,
    CONSTRAINT [CodigosScrap_pkey] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[CodigosParo] (
    [Codigo] VARCHAR(10) NOT NULL,
    [Descripcion] VARCHAR(30) NOT NULL,
    [Tipo] VARCHAR(1) NOT NULL,
    CONSTRAINT [CodigosParo_pkey] PRIMARY KEY CLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[RegistroTiempos] (
    [id] INT NOT NULL,
    [Timestamp] DATETIME2 NOT NULL,
    [Maqunia] VARCHAR(15) NOT NULL,
    [Orden] VARCHAR(15) NOT NULL,
    [Fechalnicio] DATETIME2 NOT NULL,
    [FechaFin] DATETIME2 NOT NULL,
    [Duracion] FLOAT(53) NOT NULL,
    [Codigo] VARCHAR(10) NOT NULL,
    [Tipo] VARCHAR(1) NOT NULL,
    [Comentarios] VARCHAR(50) NOT NULL,
    CONSTRAINT [RegistroTiempos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RegistroProducto] (
    [id] INT NOT NULL,
    [Timestamp] DATETIME2 NOT NULL,
    [Maqunia] VARCHAR(15) NOT NULL,
    [Orden] VARCHAR(15) NOT NULL,
    [Fechalnicio] DATETIME2 NOT NULL,
    [FechaFin] DATETIME2 NOT NULL,
    [Cantidad] INT NOT NULL,
    [Ud] VARCHAR(15) NOT NULL,
    [Tipo] VARCHAR(3) NOT NULL,
    CONSTRAINT [RegistroProducto_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[NombreImpresoras] (
    [id] INT NOT NULL,
    [Impresora] VARCHAR(30) NOT NULL,
    [Descripcion] VARCHAR(30) NOT NULL,
    CONSTRAINT [NombreImpresoras_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[NombreEtiquetas] (
    [id] INT NOT NULL,
    [Descripcion] VARCHAR(30) NOT NULL,
    [Etiqueta] VARCHAR(30) NOT NULL,
    CONSTRAINT [NombreEtiquetas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RegistroConsumos] (
    [id] INT NOT NULL,
    [Timestamp] DATETIME2 NOT NULL,
    [Maqunia] VARCHAR(15) NOT NULL,
    [Orden] VARCHAR(15) NOT NULL,
    [Fechalnicio] DATETIME2 NOT NULL,
    [FechaFin] DATETIME2 NOT NULL,
    [Cantidad] INT NOT NULL,
    [Ud] VARCHAR(15) NOT NULL,
    CONSTRAINT [RegistroConsumos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Alertas] (
    [id] INT NOT NULL,
    [Timestamp] DATETIME2 NOT NULL,
    [Tipo] VARCHAR(15) NOT NULL,
    [Descripcion] VARCHAR(30) NOT NULL,
    CONSTRAINT [Alertas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Impresion] (
    [id] INT NOT NULL,
    [Timestamp] DATETIME2 NOT NULL,
    [Impresora] VARCHAR(30) NOT NULL,
    [Etiqueta] VARCHAR(30) NOT NULL,
    [Cantidad] INT NOT NULL,
    CONSTRAINT [Impresion_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
