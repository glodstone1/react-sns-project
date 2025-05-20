# 공포스타그램 - 이 얘기, 해도 될까..?

공포와 오컬트에 관심 있는 유저들을 위한 소셜 네트워크 서비스입니다.  

---

## 💡 프로젝트 소개

- 공포, 실화, 목격담, 꿈 이야기 등 테마 기반의 커뮤니티
- 사용자 간의 교류와 실시간 소통을 강화한 SNS
- 다크 테마 UI로 공포 분위기 연출

---

## 📅 개발 기간

- **2025.05.07 ~ 2025.05.19**
- **개인 프로젝트**
- 기능별 모듈화 구조 중심 설계 및 구현

---

## 🛠 사용 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | React, MUI(Material UI), Socket.IO-Client |
| **Backend** | Node.js, Express.js, JWT, Socket.IO |
| **Database** | MySQL |
| **개발 환경** | VSCode, GitHub, HeidiSQL |
| **암호화 방식** | JWT 토큰 해시화 |

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)


---

## 📄 주요 기능 소개

### 🧍‍♂️ 사용자 기능
- 회원가입 / 로그인  


![로그인 화면](https://github.com/user-attachments/assets/1e894196-4403-45d4-b167-08801995a669)





  
- 마이페이지: 자기소개, 프로필 이미지, 본인 게시글 관리

  
![마이페이지](https://github.com/user-attachments/assets/170c7cce-c319-4a29-bf76-f4125286ef0a)  


- JWT 토큰 기반 인증 유지


### 🖼 게시글
- 공포 게시글 등록 (썸네일 이미지 포함)
- 게시글 카테고리 분류 (실화, 목격담, 꿈, 불가사의 등)

![게시물 쓰기](https://github.com/user-attachments/assets/dd0f4481-079a-4ff2-bf90-3ad1cb3e2434)

- 댓글 / 대댓글 작성

![댓글란](https://github.com/user-attachments/assets/2c03609a-7581-4aa7-8f8a-f670f711c270)



- 좋아요(추천) 기능![피드추천](https://github.com/user-attachments/assets/1eb44799-246f-4012-abc3-7e3c250b2c83)



- 게시글 수정 / 삭제


### 📥 알림 기능
- 댓글, 좋아요, 팔로우 발생 시 **실시간 알림** 수신
- 최근 알림은 MENU '속삭임 보관함'에서 확인 가능

![알림 창 메시지](https://github.com/user-attachments/assets/878a5796-ad77-4323-83d4-20fea7c09e20)![알림창 보관함](https://github.com/user-attachments/assets/e44ebcb8-d7ea-49ad-92da-eff715ade9fb)


- 알림 클릭 시 관련 게시물 및 동행(팔로우) 한 유저 페이지로 이동

### 🤝 팔로우 기능
- 인스타그램 스타일의 동행자(팔로우) / 동행포기(언팔로우) 기능

![동행 완료](https://github.com/user-attachments/assets/30ad79c2-b3de-4c4d-b4b5-d965816a83df)


![팔로우 리스트](https://github.com/user-attachments/assets/d88b55d7-4b63-45cc-9f5b-f97bd6d966ad)

### 💌 DM (다이렉트 메시지)
- 유저 검색(닉네임 또는 이메일) 후 1:1 채팅 가능
- Socket.IO를 이용한 실시간 메시지 전송 및 수신

![DM 하기](https://github.com/user-attachments/assets/79e139e3-4126-4013-a1d4-0384bf1aef6c)



---

## 🙌 프로젝트 후기

sns라는 추상적인 프로젝트를 진행하면서
가장 어려웠던 것이 아이디어 였던 것 같습니다.
대중적인 sns를 개성화 시키려고 고민을 하다 얻게 된 공포/오컬트 커뮤니티
라는 틀이 잡히자 어렵지만 여러 기능을 구현해보는 경험을 하게 되었습니다.

개인 프로젝트용으로 설계 진행 하느라 신경쓰지 못한 점, 놓친 점이 많았지만
이렇게 한 프로젝트를 스스로 마감하는 인상깊은 첫 경험이었습니다.

나머지 아쉬운 부분은 다음 프로젝트 혹은 다음 개발을 하며 가슴에 묻고
차차 좋은 경험과 스킬을 연마하겠습니다. 감사합니다.

---
