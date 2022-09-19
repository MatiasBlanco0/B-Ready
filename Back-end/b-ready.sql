-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 19-09-2022 a las 14:41:06
-- Versión del servidor: 5.7.17-log
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `b-ready`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `relacion usuario/tarea`
--

CREATE TABLE `relacion usuario/tarea` (
  `ID` int(11) NOT NULL,
  `Email` varchar(40) NOT NULL,
  `Tarea` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `relacion usuario/tarea`
--

INSERT INTO `relacion usuario/tarea` (`ID`, `Email`, `Tarea`) VALUES
(7, 'juan@gmail.com', 7),
(11, 'nahuelPer@gmail.com', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(40) NOT NULL,
  `Descripcion` varchar(200) NOT NULL,
  `CantEj` tinyint(4) NOT NULL,
  `CantEjHechos` tinyint(4) NOT NULL,
  `Materia` varchar(60) NOT NULL,
  `FechaEntrega` date NOT NULL,
  `Dificultad` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`ID`, `Nombre`, `Descripcion`, `CantEj`, `CantEjHechos`, `Materia`, `FechaEntrega`, `Dificultad`) VALUES
(7, 'Pegarme un tiro', 'Pegarme un tiro, eso', 10, 0, 'Vida Real', '2022-09-14', 127);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Nombre` varchar(24) NOT NULL,
  `Email` varchar(48) NOT NULL,
  `Contrasenia` varchar(64) NOT NULL,
  `Token` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Nombre`, `Email`, `Contrasenia`, `Token`) VALUES
('Juancito', 'juan@gmail.com', '83352d69270d50a99cfef2b3d6317aa2d3b1029aa3ee566bcf93eedfb695f539', ''),
('Nahuel_P', 'nahuelPer@gmail.com', '39caad2557d3cbc00e846f386d0778ee5017770cba01a7e41fa73a7acd2b6e7a', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `relacion usuario/tarea`
--
ALTER TABLE `relacion usuario/tarea`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `relacion usuario/tarea`
--
ALTER TABLE `relacion usuario/tarea`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
