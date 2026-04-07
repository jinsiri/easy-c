# 🏢 EASY-C (Groupware System)

**EASY-C**는 기업의 효율적인 자원 관리와 협업을 위해 설계된 차세대 그룹웨어 시스템입니다.  
Spring Boot와 Next.js의 최신 기능을 활용하여 견고한 백엔드 아키텍처와 반응형 UI를 제공합니다.

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
* **Framework**: Spring Boot 3.5.6 (Java 17)
* **Database**: PostgreSQL
* **ORM/Query**: Spring Data JPA & Querydsl 5.0 (Jakarta)
* **Security**: Spring Security & JWT (JSON Web Token)
* **Excel Library**: Alibaba EasyExcel (고성능 엑셀 처리)
* **Utility**: Lombok, Spring-Dotenv (환경 변수 관리), Hibernate Validator

### **Frontend (Next.js)**
* **Framework**: Next.js 15.1 (App Router)
* **State Management**: Zustand (경량화된 상태 관리)
* **UI Library**: Material UI (MUI) v7 & Emotion
* **Data Table**: AG-Grid (Enterprise급 데이터 그리드)
* **Form Management**: React Hook Form & Zod (타입 안정성 검증)
* **Chart**: Apache Echarts (반응형 차트)
* **Communication**: Axios (HTTP Client)

---
