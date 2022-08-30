-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-08-2022 a las 12:40:20
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
(1, 'test@test.test', 1),
(2, 'hola@gmail.com', 1),
(3, 'juancito@gmail.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(40) NOT NULL,
  `Descripcion` varchar(200) NOT NULL,
  `CantEj` int(11) NOT NULL,
  `CantEjHechos` int(11) NOT NULL,
  `Materia` varchar(60) NOT NULL,
  `FechaEntrega` date NOT NULL,
  `Dificultad` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`ID`, `Nombre`, `Descripcion`, `CantEj`, `CantEjHechos`, `Materia`, `FechaEntrega`, `Dificultad`) VALUES
(1, 'Proyecto', 'Proyecto B-ready B)', 10, 2, 'TIC', '2022-11-20', 127);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Nombre` varchar(20) NOT NULL,
  `Email` varchar(40) NOT NULL,
  `Contrasenia` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Nombre`, `Email`, `Contrasenia`) VALUES
('Hola', 'hola@gmail.com', 'hola123'),
('Juan', 'juancito@gmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'),
('Test', 'Test@test.test', 'incorrecta');

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
