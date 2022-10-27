-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 27-10-2022 a las 13:52:39
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
-- Estructura de tabla para la tabla `relacion_usuario_tarea`
--

CREATE TABLE `relacion_usuario_tarea` (
  `ID` int(11) NOT NULL,
  `Email` varchar(48) NOT NULL,
  `Tarea` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `relacion_usuario_tarea`
--

INSERT INTO `relacion_usuario_tarea` (`ID`, `Email`, `Tarea`) VALUES
(2, 'nahuelPer@gmail.com', 7),
(4, 'juan@gmail.com', 8),
(19, 'test@gmail.com', 22);

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
  `Dificultad` tinyint(4) NOT NULL,
  `TrabajoHoy` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`ID`, `Nombre`, `Descripcion`, `CantEj`, `CantEjHechos`, `Materia`, `FechaEntrega`, `Dificultad`, `TrabajoHoy`) VALUES
(7, 'Pegarme un tiro', 'Pegarme un tiro, eso', 10, 0, 'Vida Real', '2022-09-14', 127, 0),
(8, 'Cocinar mandalas', 'Me deje el horno prendido', 2, 1, 'Cocina', '2022-09-23', 127, 0),
(22, 'Terminar Proyecto', 'Ayudaaaaaaaaaaaa', 127, 10, 'Proyecto', '2022-10-31', 127, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Nombre` varchar(24) NOT NULL,
  `Email` varchar(48) NOT NULL,
  `Contrasenia` varchar(64) NOT NULL,
  `Token` varchar(256) NOT NULL,
  `Estilo` varchar(19) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Nombre`, `Email`, `Contrasenia`, `Token`, `Estilo`) VALUES
('Juancito', 'juan@gmail.com', '83352d69270d50a99cfef2b3d6317aa2d3b1029aa3ee566bcf93eedfb695f539', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZ21haWwuY29tIiwiaWF0IjoxNjY2Mjg0ODcxfQ.Q-BPxWWFFxDtMLyCx8WzKUCX8CCv9aQ3yhYEkH9DUQs', 'Oscuro Tritanopia'),
('Nahuel_P', 'nahuelPer@gmail.com', '39caad2557d3cbc00e846f386d0778ee5017770cba01a7e41fa73a7acd2b6e7a', 'null', ''),
('Test', 'test@gmail.com', '167c675e41e07059088728924744805f06dfc328eedf5f1939dd8143d6d78226', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjY2ODY3ODY3fQ.sueoFQ2is12TAV392M68oAvkchSNOfcmvpxDtpAszmM', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `relacion_usuario_tarea`
--
ALTER TABLE `relacion_usuario_tarea`
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
-- AUTO_INCREMENT de la tabla `relacion_usuario_tarea`
--
ALTER TABLE `relacion_usuario_tarea`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
