-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/07/2025 às 04:45
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `travelbuddy`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `FollowUser` (IN `followerId` INT, IN `followedId` INT)   begin
declare already_following int;
select count(*) into already_following
from follow
where follower_id = followerId and followed_id = followedId;
if followerId = followedId then
signal sqlstate "45000" set message_text = "Um usuario nao pode seguir a si mesmo.";
elseif already_following > 0 then
signal sqlstate "45000" set message_text = "Voce ja esta seguindo este usuario.";
else
insert into follow (follower_id, followed_id) values (followerId, followedId);
select "Voce agora esta seguindo este usuario." as message;
end if;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `comment`
--

CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  `comment_text` text NOT NULL,
  `comment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `country`
--

CREATE TABLE `country` (
  `country_id` int(11) NOT NULL,
  `country_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `country`
--

INSERT INTO `country` (`country_id`, `country_name`) VALUES
(1, 'Brazil'),
(2, 'France'),
(3, 'Japan');

-- --------------------------------------------------------

--
-- Estrutura para tabela `follow`
--

CREATE TABLE `follow` (
  `follow_id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `followed_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `post`
--

CREATE TABLE `post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `post_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `post_name` varchar(255) NOT NULL,
  `post_desc` text DEFAULT NULL,
  `post_image` varchar(255) DEFAULT NULL,
  `post_tags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `post`
--

INSERT INTO `post` (`post_id`, `user_id`, `country_id`, `post_date`, `post_name`, `post_desc`, `post_image`, `post_tags`) VALUES
(1, 1, 2, '2025-07-08 02:43:21', 'Dicas de Paris', 'Descubra cantinhos escondidos e charmosos da cidade luz.', '/images/post_image.png', 'paris,dicas,viagem'),
(2, 1, 2, '2025-07-08 02:43:21', 'A melhor baguette', 'Experimentei baguettes de todos os bairros. Veja minhas favoritas!', '/images/post_image.png', 'comida,baguette,fran?a'),
(3, 1, 2, '2025-07-08 02:43:21', 'Passeio pelo Sena', 'Reflex?es sobre um fim de tarde navegando no Sena.', '/images/post_image.png', 'rio sena,cruzeiro,rom?ntico'),
(4, 1, 2, '2025-07-08 02:43:21', 'Arte nas ruas', 'Grafites, performances e arte urbana em Montmartre.', '/images/post_image.png', 'arte,rua,montmartre');

--
-- Acionadores `post`
--
DELIMITER $$
CREATE TRIGGER `UpdatePostCount_Delete` AFTER DELETE ON `post` FOR EACH ROW begin
update User set user_postcount = user_postcount - 1
where user_id = old.user_id;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `UpdatePostCount_Insert` AFTER INSERT ON `post` FOR EACH ROW begin
update User set user_postcount = user_postcount + 1
where user_id = new.user_id;
end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `rate`
--

CREATE TABLE `rate` (
  `rate_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  `travel_id` int(11) DEFAULT NULL,
  `rate_score` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `travel`
--

CREATE TABLE `travel` (
  `travel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `travel_title` varchar(255) NOT NULL,
  `travel_desc` text DEFAULT NULL,
  `travel_duration` varchar(50) DEFAULT NULL,
  `travel_url` varchar(255) DEFAULT NULL,
  `travel_thumbnail` varchar(255) DEFAULT NULL,
  `travel_visibility` enum('public','private','unlisted') NOT NULL DEFAULT 'public'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_desc` text DEFAULT 'Olá! Sou novo no TravelBuddy!',
  `user_pfp` varchar(255) DEFAULT NULL,
  `user_banner` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `country_id` int(11) DEFAULT NULL,
  `user_postcount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_password`, `user_desc`, `user_pfp`, `user_banner`, `admin`, `country_id`, `user_postcount`) VALUES
(1, 'Pierre Baguette', 'pierre@gmail.com', '123', 'Bonjour! Eu sou Pierre, um franc?s apaixonado por viagens, culturas e boas hist?rias. Aqui compartilho minhas experi?ncias pelo mundo com dicas e curiosidades.', '/images/profilepic.png', 'images/profilebanner.png', 0, 2, 4);

-- --------------------------------------------------------

--
-- Estrutura para tabela `video`
--

CREATE TABLE `video` (
  `video_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `travel_id` int(11) DEFAULT NULL,
  `country_id` int(11) NOT NULL,
  `video_views` int(20) NOT NULL,
  `video_title` varchar(255) NOT NULL,
  `video_desc` text DEFAULT NULL,
  `video_url` varchar(255) NOT NULL,
  `video_thumbnail` varchar(255) DEFAULT NULL,
  `video_tags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `video`
--

INSERT INTO `video` (`video_id`, `user_id`, `travel_id`, `country_id`, `video_views`, `video_title`, `video_desc`, `video_url`, `video_thumbnail`, `video_tags`) VALUES
(1, 1, NULL, 2, 1500, 'Passeando pelo Louvre', 'Visitando o famoso museu.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'arte,paris,louvre'),
(2, 1, NULL, 2, 2000, 'Tour pela Torre Eiffel', 'Uma vista incr?vel da cidade.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'torre eiffel,paris,viagem'),
(3, 1, NULL, 2, 1000, 'Comendo baguette em Paris', 'Um tour gastron?mico pela Fran?a.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'comida,fran?a,baguette'),
(4, 1, NULL, 2, 800, 'Conhecendo Montmartre', 'Bairro art?stico de Paris.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'montmartre,arte,fran?a'),
(5, 1, NULL, 2, 1200, 'Passeio pelo Sena', 'Cruzeiro pelo rio Sena.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'rio sena,paris,cruzeiro'),
(6, 1, NULL, 2, 500, 'Caf?s de Paris', 'Melhores caf?s para visitar.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'caf?s,paris,gastronomia'),
(7, 1, NULL, 2, 900, 'Mercados franceses', 'Visitando mercados locais.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'mercado,fran?a,comida'),
(8, 1, NULL, 2, 1100, 'Noite em Paris', 'Explorando a vida noturna.', 'https://www.youtube.com/watch?v=wgNPCKuX9ds', '/images/video_image.png', 'noite,paris,festa');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `video_id` (`video_id`);

--
-- Índices de tabela `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`country_id`),
  ADD UNIQUE KEY `country_name` (`country_name`);

--
-- Índices de tabela `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`follow_id`),
  ADD UNIQUE KEY `unique_follow` (`follower_id`,`followed_id`),
  ADD KEY `followed_id` (`followed_id`);

--
-- Índices de tabela `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `country_id` (`country_id`),
  ADD KEY `idx_post_user` (`user_id`);

--
-- Índices de tabela `rate`
--
ALTER TABLE `rate`
  ADD PRIMARY KEY (`rate_id`),
  ADD UNIQUE KEY `unique_rate` (`user_id`,`post_id`,`video_id`,`travel_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `video_id` (`video_id`),
  ADD KEY `travel_id` (`travel_id`);

--
-- Índices de tabela `travel`
--
ALTER TABLE `travel`
  ADD PRIMARY KEY (`travel_id`),
  ADD UNIQUE KEY `travel_url` (`travel_url`),
  ADD KEY `country_id` (`country_id`),
  ADD KEY `idx_travel_user` (`user_id`);

--
-- Índices de tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD KEY `country_id` (`country_id`);

--
-- Índices de tabela `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`video_id`),
  ADD KEY `travel_id` (`travel_id`),
  ADD KEY `country_id` (`country_id`),
  ADD KEY `idx_video_user` (`user_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `comment`
--
ALTER TABLE `comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `country`
--
ALTER TABLE `country`
  MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `follow`
--
ALTER TABLE `follow`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `post`
--
ALTER TABLE `post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `rate`
--
ALTER TABLE `rate`
  MODIFY `rate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `travel`
--
ALTER TABLE `travel`
  MODIFY `travel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `video`
--
ALTER TABLE `video`
  MODIFY `video_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`video_id`) REFERENCES `video` (`video_id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `rate`
--
ALTER TABLE `rate`
  ADD CONSTRAINT `rate_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rate_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rate_ibfk_3` FOREIGN KEY (`video_id`) REFERENCES `video` (`video_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rate_ibfk_4` FOREIGN KEY (`travel_id`) REFERENCES `travel` (`travel_id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `travel`
--
ALTER TABLE `travel`
  ADD CONSTRAINT `travel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `travel_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `video_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `video_ibfk_2` FOREIGN KEY (`travel_id`) REFERENCES `travel` (`travel_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `video_ibfk_3` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
