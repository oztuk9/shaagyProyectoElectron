-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.12-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.0.0.6104
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Volcando estructura para tabla mantenimiento.area
CREATE TABLE IF NOT EXISTS `area` (
  `id_area` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(180) NOT NULL,
  PRIMARY KEY (`id_area`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla mantenimiento.maquina
CREATE TABLE IF NOT EXISTS `maquina` (
  `id_maquina` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `area` varchar(80) NOT NULL,
  `subarea` varchar(80) NOT NULL,
  `name` varchar(180) NOT NULL,
  `code` varchar(30) NOT NULL DEFAULT '',
  `model` varchar(80) NOT NULL DEFAULT '',
  `serie` varchar(20) NOT NULL DEFAULT '',
  `brand` varchar(50) NOT NULL DEFAULT '',
  `photo` mediumblob NOT NULL,
  `description` mediumtext NOT NULL DEFAULT '',
  PRIMARY KEY (`id_maquina`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla mantenimiento.orden
CREATE TABLE IF NOT EXISTS `orden` (
  `id_orden` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `maquina` varchar(200) NOT NULL,
  `responsable` varchar(180) NOT NULL,
  `actividades` text DEFAULT '',
  `repuestos` text DEFAULT '',
  `costo` double unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla mantenimiento.plan_mantenimiento
CREATE TABLE IF NOT EXISTS `plan_mantenimiento` (
  `id_plan` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `maquina` varchar(200) NOT NULL,
  `responsable` varchar(180) NOT NULL,
  `frecuencia` varchar(12) NOT NULL DEFAULT 'Semanal',
  `date_start` date NOT NULL,
  `actividades` text NOT NULL DEFAULT '',
  `nombreArchivo` varchar(240) DEFAULT NULL,
  `archivo` longblob DEFAULT NULL,
  PRIMARY KEY (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla mantenimiento.reporte_mantenimiento
CREATE TABLE IF NOT EXISTS `reporte_mantenimiento` (
  `id_plan` int(11) NOT NULL DEFAULT 0,
  `id_matriz` int(10) unsigned NOT NULL,
  `subarea` varchar(80) NOT NULL,
  `periosidad` varchar(50) NOT NULL,
  `responsable` varchar(80) NOT NULL,
  `fechas_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id_plan`),
  KEY `id_formato` (`id_matriz`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla mantenimiento.reporte_trabajo
CREATE TABLE IF NOT EXISTS `reporte_trabajo` (
  `fk_orden_trabajo` int(10) unsigned NOT NULL,
  `folio` varchar(10) NOT NULL,
  `area` varchar(80) NOT NULL,
  `solicitante` varchar(80) NOT NULL,
  `tipo` varchar(80) NOT NULL,
  `describcion` text NOT NULL,
  `prioridad` varchar(20) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `responsable` varchar(80) NOT NULL,
  `cargo` varchar(80) NOT NULL,
  `estatus` varchar(15) NOT NULL,
  `retraso` varchar(10) NOT NULL,
  `centro_costos` varchar(15) NOT NULL,
  `observaciones` mediumtext DEFAULT NULL,
  `cantidad` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `refacciones` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `costo` double unsigned NOT NULL DEFAULT 0,
  `personal` varchar(3) NOT NULL,
  `tiempo` time DEFAULT NULL,
  `costo_obra` double unsigned NOT NULL DEFAULT 0,
  `total` double unsigned NOT NULL DEFAULT 0,
  KEY `fk_orden_trabajo` (`fk_orden_trabajo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para procedimiento mantenimiento.search_area
DELIMITER //
CREATE PROCEDURE `search_area`(
	IN `search` VARCHAR(180)
)
BEGIN
	SET @find = CONCAT('%',search, '%');
	SELECT * FROM area WHERE name LIKE @find;
END//
DELIMITER ;

-- Volcando estructura para procedimiento mantenimiento.search_maquina
DELIMITER //
CREATE PROCEDURE `search_maquina`(
	IN `search` VARCHAR(180)
)
BEGIN
	SET @find = CONCAT('%',search, '%');
	SELECT * FROM maquina WHERE( CONCAT ( NAME, '|', code, '|', model, '|', serie, '|', brand, '|', area, '|', subarea ) ) LIKE @find;
END//
DELIMITER ;

-- Volcando estructura para procedimiento mantenimiento.search_orden
DELIMITER //
CREATE PROCEDURE `search_orden`(
	IN `search` VARCHAR(180)
)
BEGIN
	SET @find = CONCAT('%',search, '%');
	SELECT id_orden, DATE_FORMAT( fecha, '%d-%m-%Y') as fecha, maquina, responsable, costo FROM orden WHERE( CONCAT ( id_orden, '|', fecha, '|', maquina, '|', responsable, '|', costo ) ) LIKE @find;
END//
DELIMITER ;

-- Volcando estructura para procedimiento mantenimiento.search_plan
DELIMITER //
CREATE PROCEDURE `search_plan`(
	IN `search` VARCHAR(240)
)
BEGIN
	SET @find = CONCAT('%',search, '%');
	SELECT id_plan, maquina, responsable, frecuencia, nombreArchivo FROM plan_mantenimiento WHERE CONCAT( maquina, '|', responsable, '|', frecuencia, '|', nombreArchivo ) LIKE @find;
END//
DELIMITER ;

-- Volcando estructura para procedimiento mantenimiento.search_subarea
DELIMITER //
CREATE PROCEDURE `search_subarea`(
	IN `search` VARCHAR(180)
)
BEGIN
	SET @find = CONCAT('%',search, '%');
	SELECT * FROM subarea WHERE name LIKE @find;
END//
DELIMITER ;

-- Volcando estructura para procedimiento mantenimiento.search_user
DELIMITER //
CREATE PROCEDURE `search_user`(
	IN `search` VARCHAR(200)
)
BEGIN
	SET @find = CONCAT('%',search, '%');
	SELECT * FROM usuario WHERE( CONCAT ( NAME, '|', charge, '|', phone, '|', card ) ) LIKE @find;
END//
DELIMITER ;

-- Volcando estructura para tabla mantenimiento.subarea
CREATE TABLE IF NOT EXISTS `subarea` (
  `id_subarea` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fk_area` int(10) unsigned NOT NULL,
  `name` varchar(180) NOT NULL,
  PRIMARY KEY (`id_subarea`),
  KEY `FK_subarea_area` (`fk_area`),
  CONSTRAINT `FK_subarea_area` FOREIGN KEY (`fk_area`) REFERENCES `area` (`id_area`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla mantenimiento.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_user` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `charge` varchar(150) NOT NULL,
  `phone` varchar(18) NOT NULL DEFAULT '',
  `card` varchar(18) NOT NULL DEFAULT '',
  `photo` mediumblob NOT NULL DEFAULT '',
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
