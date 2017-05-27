/*
Navicat MySQL Data Transfer

Source Server         : F_Home
Source Server Version : 50554
Source Host           : 192.168.1.29:3306
Source Database       : LO07

Target Server Type    : MYSQL
Target Server Version : 50554
File Encoding         : 65001

Date: 2017-05-27 16:20:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cursus
-- ----------------------------
DROP TABLE IF EXISTS `cursus`;
CREATE TABLE `cursus` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `type` enum('TC','BR','TCBR','FCBR','UTT') DEFAULT NULL,
  PRIMARY KEY (`cid`),
  KEY `sidc` (`sid`),
  KEY `uidc` (`uid`),
  CONSTRAINT `sidc` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`),
  CONSTRAINT `uidc` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for elm_cursus
-- ----------------------------
DROP TABLE IF EXISTS `elm_cursus`;
CREATE TABLE `elm_cursus` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `s_seq` int(2) DEFAULT NULL,
  `s_label` varchar(5) DEFAULT NULL,
  `sigle` varchar(10) DEFAULT NULL,
  `categorie` enum('CS','TM','EC','CT','HT','ME','ST','SE','HP','NPML') DEFAULT NULL,
  `affectation` enum('TC','BR','TCBR','FCBR','UTT') DEFAULT NULL,
  `utt` enum('Y','N') DEFAULT NULL,
  `profil` enum('Y','N') DEFAULT NULL,
  `credit` int(3) DEFAULT NULL,
  `resultat` enum('A','B','C','D','E','F','ABS','RES','EQU','ADM') DEFAULT NULL,
  PRIMARY KEY (`eid`),
  KEY `cide` (`cid`),
  CONSTRAINT `cide` FOREIGN KEY (`cid`) REFERENCES `cursus` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=936 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for staff
-- ----------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `sid` int(8) NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) DEFAULT NULL,
  `prenom` varchar(30) DEFAULT NULL,
  `appartment` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `sid` int(8) NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) DEFAULT NULL,
  `prenom` varchar(30) DEFAULT NULL,
  `admission` enum('no','TC','BR') DEFAULT NULL,
  `filiere` enum('no','?','MPL','MSI','MRI','LIB') DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=2341235 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(128) NOT NULL,
  `salt` varchar(32) NOT NULL,
  `type` enum('student','staff','admin') NOT NULL,
  `sid` int(8) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `email` (`email`),
  KEY `uid` (`uid`),
  KEY `sid_sta` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
