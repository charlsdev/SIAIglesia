-- 
-- Creamos la DB
-- 
CREATE DATABASE ssmiglesia;

-- 
-- Usamos la DB
-- 
USE ssmiglesia;

-- 
-- Creamos la DB `Usuarios`
-- 
CREATE TABLE `usuarios` (
   `cedula` varchar(10) NOT NULL,
   `apellidos` varchar(75) NOT NULL,
   `nombres` varchar(75) NOT NULL,
   `fechNacimiento` varchar(10) NOT NULL,
   `genero` varchar(10) NOT NULL,
   `telefono` varchar(10) NOT NULL,
   `email` varchar(50) NOT NULL,
   `password` varchar(150) NOT NULL,
   `privilegio` varchar(15) NOT NULL,
   `estado` varchar(15) NOT NULL,
   `photoProfile` varchar(50) NOT NULL,
   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 
-- Alteramos la table `Usuarios`
-- 
ALTER TABLE
   ADD PRIMARY KEY (`cedula`);

-- 
-- Creamos la tabla `Bautizo`
-- 
CREATE TABLE `bautizo` (
   `_id` varchar(6) NOT NULL,
   `apellidos` varchar(50) NOT NULL,
   `nombres` varchar(50) NOT NULL,
   `lugarNacimiento` varchar(50) NOT NULL,
   `fechaNacimiento` varchar(10) NOT NULL,
   `namePadre` varchar(100) NOT NULL,
   `nameMadre` varchar(100) NOT NULL,
   `namePadrino` varchar(100) NOT NULL,
   `nameMadrina` varchar(100) NOT NULL,
   `nameSacerdote` varchar(100) NOT NULL,
   `anioRParroquial` int(4) NOT NULL,
   `tomoRParroquial` int(8) NOT NULL,
   `paginaRParroquial` int(8) NOT NULL,
   `numeroRParroquial` int(8) NOT NULL,
   `ciudadRCivil` varchar(25) NOT NULL,
   `numeroRCivil` int(8) NOT NULL,
   `tomoRCivil` int(8) NOT NULL,
   `paginaRCivil` int(8) NOT NULL,
   `numeroActaRCivil` int(8) NOT NULL,
   `idCedula` varchar(10) NOT NULL,
   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`_id`),
   KEY `fk_cedula` (`idCedula`),
   CONSTRAINT `fk_cedula` FOREIGN KEY (`idCedula`) REFERENCES `usuarios` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 
-- Creamos la tabla `Matrimonio`
-- 
CREATE TABLE `matrimonio` (
   `_id` varchar(6) NOT NULL,
   `fechaMatrimonio` varchar(10) NOT NULL,
   `nameSacerdote` varchar(100) NOT NULL,
   `nameEsposo` varchar(100) NOT NULL,
   `namePadreEsposo` varchar(100) NOT NULL,
   `nameMadreEsposo` varchar(100) NOT NULL,
   `nameEsposa` varchar(100) NOT NULL,
   `namePadreEsposa` varchar(100) NOT NULL,
   `nameMadreEsposa` varchar(100) NOT NULL,
   `namePadrino` varchar(100) NOT NULL,
   `nameMadrina` varchar(100) NOT NULL,
   `ciudadRCivil` varchar(25) NOT NULL,
   `añoRCivil` int(8) NOT NULL,
   `tomoRCivil` int(8) NOT NULL,
   `paginaRCivil` int(8) NOT NULL,
   `numeroActaRCivil` int(8) NOT NULL,
   `fecha` varchar(10) NOT NULL,
   `idCedula` varchar(10) NOT NULL,
   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`_id`),
   KEY `fk_idCedula` (`idCedula`),
   CONSTRAINT `fk_idCedula` FOREIGN KEY (`idCedula`) REFERENCES `usuarios` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 
-- Creamos la tabla `Comunion`
--
CREATE TABLE `comunion` (
   `_id` varchar(6) NOT NULL,
   `anioSacramento` varchar(4) NOT NULL,
   `cedula` varchar(10) NOT NULL,
   `apellidos` varchar(50) NOT NULL,
   `nombres` varchar(50) NOT NULL,
   `namePadre` varchar(100) NOT NULL,
   `nameMadre` varchar(100) NOT NULL,
   `namePadrino` varchar(100) NOT NULL,
   `nameMadrina` varchar(100) NOT NULL,
   `nameCatequista` varchar(100) NOT NULL,
   `idCedula` varchar(10) NOT NULL,
   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`_id`),
   KEY `fk_cedulaU` (`idCedula`),
   CONSTRAINT `fk_cedulaU` FOREIGN KEY (`idCedula`) REFERENCES `usuarios` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 
-- Creamos la tabla `Confirmación`
--
CREATE TABLE `confirmacion` (
   `_id` varchar(6) NOT NULL,
   `anioSacramento` varchar(4) NOT NULL,
   `cedula` varchar(10) NOT NULL,
   `apellidos` varchar(50) NOT NULL,
   `nombres` varchar(50) NOT NULL,
   `namePadrino` varchar(100) NOT NULL,
   `nameMadrina` varchar(100) NOT NULL,
   `nameMonsenior` varchar(100) NOT NULL,
   `temploComunion` varchar(50) NOT NULL,
   `idCedula` varchar(10) NOT NULL,
   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`_id`),
   KEY `fk_cedulaUser` (`idCedula`),
   CONSTRAINT `fk_cedulaUser` FOREIGN KEY (`idCedula`) REFERENCES `usuarios` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;