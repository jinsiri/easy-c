# 🏢 EASY-C (Groupware System)
**EASY-C**는 기업의 효율적인 자원 관리와 협업을 위해 설계된 차세대 그룹웨어 시스템입니다.  
Spring Boot와 Next.js의 최신 기능을 활용하여 견고한 백엔드 아키텍처와 반응형 UI를 제공합니다.

![메인이미지](./readme/main.png)

---

## ✨ Key Features

* **조직 설계 (Organization Design)**: `@minoru/react-dnd-treeview` 및 `MUI TreeView`를 활용한 직관적인 조직도 구성 및 관리
* **근태 및 휴가 관리 (Attendance & Leave)**: `react-calendar-timeline` 기반의 스케줄 관리 및 `dayjs`를 활용한 정밀한 시간 계산
* **회원 시스템 & 보안 (Auth & Security)**: Spring Security와 JWT(jjwt) 기반의 인증 체계 및 `jsencrypt`를 통한 클라이언트 보안 강화
* **감사 이력 및 데이터 관리 (Audit & Data)**: Spring AOP를 활용한 이력 추적 및 `Querydsl` 기반의 고성능 데이터 조회
* **고성능 게시판 (Board)**: `React Quill` 에디터 지원 및 `ag-grid`를 활용한 대용량 게시글 리스트 조회
* **데이터 시각화 및 리포트**: `Echarts`를 활용한 인사이트 대시보드 및 `EasyExcel` 기반의 대용량 데이터 엑셀 반출입

---

## 🛠 Tech Stack

### **Backend (Spring Boot)**
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/springboot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Postgres](https://img.shields.io/badge/postgresql-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white)

* **Framework**: Spring Boot 3.5.6 (Java 17)
* **Database**: PostgreSQL
* **ORM/Query**: Spring Data JPA & Querydsl 5.0 (Jakarta)
* **Security**: Spring Security & JWT (JSON Web Token)
* **Excel Library**: Alibaba EasyExcel (고성능 엑셀 처리)
* **Utility**: Lombok, Spring-Dotenv (환경 변수 관리), Hibernate Validator

### **Frontend (Next.js)**
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black.svg?style=flat-square&logo=next.js&logoColor=white)

* **Framework**: Next.js 15.1 (App Router)
* **State Management**: Zustand (경량화된 상태 관리)
* **UI Library**: Material UI (MUI) v7 & Emotion
* **Data Table**: AG-Grid (Enterprise급 데이터 그리드)
* **Form Management**: React Hook Form & Zod (타입 안정성 검증)
* **Chart**: Apache Echarts (반응형 차트)
* **Communication**: Axios (HTTP Client)

---

## 📝 Position

**진실** <br>
* 그룹웨어 기능 명세서 초안 작성 및 요구사항 정의 
* 관리자/사용자 화면의 기본 와이어프레임 설계 참여 
* 조직 및 인사 체계(부서·직급)의 트리 구조 기반 백엔드 설계 
* 조직도 및 부서 관리 기능 화면 구현 
* 관리자 모드(Admin) 주요 기능 개발 담당

**푸름** <br>
* 프로젝트 UI/UX 스타일 가이드 작성 
* 관리자/사용자 화면의 기본 와이어프레임 설계 참여 
* 근태 및 휴가 관리 시스템의 DB 모델링 및 백엔드 구조 설계 
* 근태 정책 기반 일정 관리 및 기간별 통계 차트 기능 구현
* 휴가 신청 프로세스 및 관련 비즈니스 로직 개발
* 개인 및 부서 단위 일정 캘린더 기능 구현

**민선** <br>
* 관리자 및 사용자 플로우 차트 설계
* 프로젝트 전체 ERD 설계 및 데이터 모델링
* Spring Security 기반 인증·인가 체계 구축, Refresh Token 관리
* 인사 정보 관리 DB 설계 및 관리 화면 구현
* 게시판 기능 설계 및 개발