CREATE DATABASE IF NOT EXISTS `template` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE template;

CREATE TABLE `roles` (
  `nRol` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `cRol` varchar(20) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `nUsuario` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nRol` tinyint UNSIGNED NOT NULL,
  `nEstatus` tinyint UNSIGNED NOT NULL DEFAULT 1,
  `cNombres` varchar(50) NOT NULL,
  `cApellidos` varchar(50) NOT NULL,
  `cUsuario` varchar(100) NOT NULL,
  `cPassword` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nUsuario`),
  UNIQUE KEY `uk_usuarios_cUsuario` (`cUsuario`),
  KEY `idx_usuarios_nRol` (`nRol`),
  CONSTRAINT `fk_usuarios_nRol` FOREIGN KEY (`nRol`) REFERENCES `roles` (`nRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sesiones` (
  `nSesion` int NOT NULL AUTO_INCREMENT,
  `nUsuario` int UNSIGNED NOT NULL,
  `accessKey` varchar(20) NOT NULL,
  `refreshKey` varchar(20) NOT NULL,
  `nEstatus` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nSesion`),
  KEY `idx_sesiones_nUsuario` (`nUsuario`),
  CONSTRAINT `fk_sesiones_nUsuario` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `catalogo` (
  `nIdCatalogo` int NOT NULL AUTO_INCREMENT,
  `cClave` varchar(50) NOT NULL,
  `cDescripcion` varchar(200) DEFAULT NULL,
  `bActivo` tinyint NOT NULL DEFAULT 1,
  `cCreatedBy` varchar(100) DEFAULT NULL,
  `cUpdatedBy` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`nIdCatalogo`),
  UNIQUE KEY `uk_catalogo_clave` (`cClave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `catalogo_valor` (
  `nIdCatalogoValor` int NOT NULL AUTO_INCREMENT,
  `nIdCatalogo` int NOT NULL,
  `nOrden` int NOT NULL DEFAULT 1,
  `cClave` varchar(50) NOT NULL,
  `cValor` varchar(200) NOT NULL,
  `cValorExtra` varchar(200) DEFAULT NULL,
  `bActivo` tinyint NOT NULL DEFAULT 1,
  `cCreatedBy` varchar(100) DEFAULT NULL,
  `cUpdatedBy` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`nIdCatalogoValor`),
  KEY `idx_catalogo_valor_nIdCatalogo` (`nIdCatalogo`),
  CONSTRAINT `fk_catalogo_valor_nIdCatalogo` FOREIGN KEY (`nIdCatalogo`) REFERENCES `catalogo` (`nIdCatalogo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE test;

CREATE TABLE `roles` (
  `nRol` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `cRol` varchar(20) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `nUsuario` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nRol` tinyint UNSIGNED NOT NULL,
  `nEstatus` tinyint UNSIGNED NOT NULL DEFAULT 1,
  `cNombres` varchar(50) NOT NULL,
  `cApellidos` varchar(50) NOT NULL,
  `cUsuario` varchar(100) NOT NULL,
  `cPassword` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nUsuario`),
  UNIQUE KEY `uk_usuarios_cUsuario` (`cUsuario`),
  KEY `idx_usuarios_nRol` (`nRol`),
  CONSTRAINT `fk_usuarios_nRol` FOREIGN KEY (`nRol`) REFERENCES `roles` (`nRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sesiones` (
  `nSesion` int NOT NULL AUTO_INCREMENT,
  `nUsuario` int UNSIGNED NOT NULL,
  `accessKey` varchar(20) NOT NULL,
  `refreshKey` varchar(20) NOT NULL,
  `nEstatus` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`nSesion`),
  KEY `idx_sesiones_nUsuario` (`nUsuario`),
  CONSTRAINT `fk_sesiones_nUsuario` FOREIGN KEY (`nUsuario`) REFERENCES `usuarios` (`nUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `catalogo` (
  `nIdCatalogo` int NOT NULL AUTO_INCREMENT,
  `cClave` varchar(50) NOT NULL,
  `cDescripcion` varchar(200) DEFAULT NULL,
  `bActivo` tinyint NOT NULL DEFAULT 1,
  `cCreatedBy` varchar(100) DEFAULT NULL,
  `cUpdatedBy` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`nIdCatalogo`),
  UNIQUE KEY `uk_catalogo_clave` (`cClave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `catalogo_valor` (
  `nIdCatalogoValor` int NOT NULL AUTO_INCREMENT,
  `nIdCatalogo` int NOT NULL,
  `nOrden` int NOT NULL DEFAULT 1,
  `cClave` varchar(50) NOT NULL,
  `cValor` varchar(200) NOT NULL,
  `cValorExtra` varchar(200) DEFAULT NULL,
  `bActivo` tinyint NOT NULL DEFAULT 1,
  `cCreatedBy` varchar(100) DEFAULT NULL,
  `cUpdatedBy` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`nIdCatalogoValor`),
  KEY `idx_catalogo_valor_nIdCatalogo` (`nIdCatalogo`),
  CONSTRAINT `fk_catalogo_valor_nIdCatalogo` FOREIGN KEY (`nIdCatalogo`) REFERENCES `catalogo` (`nIdCatalogo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;