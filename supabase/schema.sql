-- Supabase SQL Editor에 이 파일 전체를 붙여넣고 실행하세요.

-- 운동 종목 카탈로그 (이름이 제각각이면 진행 추이 추적이 안 되므로, 자유 입력 대신 카탈로그에서 선택)
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  equipment_type text not null check (equipment_type in ('머신','프리웨이트','맨몸')),
  body_part text not null check (body_part in ('가슴','등','하체','어깨','팔','코어')),
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);

-- 운동 기록
create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  performed_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references workout_sessions(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  notes text,
  created_at timestamptz not null default now()
);

create table workout_sets (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references workout_exercises(id) on delete cascade,
  set_index int not null,
  weight_kg numeric(6,2) not null,
  reps int not null,
  created_at timestamptz not null default now()
);

create index idx_workout_sessions_performed_at on workout_sessions (performed_at desc);
create index idx_workout_exercises_session_id on workout_exercises (session_id);
create index idx_workout_exercises_exercise_id on workout_exercises (exercise_id);
create index idx_workout_sets_exercise_id on workout_sets (exercise_id);
create index idx_exercises_body_part on exercises (body_part);

-- InBody 기록 (사진 원본 저장 안 함 — 숫자 + OCR 원문 텍스트만)
create table inbody_records (
  id uuid primary key default gen_random_uuid(),
  measured_at date not null default current_date,
  weight_kg numeric(5,2),
  skeletal_muscle_mass_kg numeric(5,2),
  body_fat_mass_kg numeric(5,2),
  body_fat_percent numeric(4,1),
  bmi numeric(4,1),
  inbody_score int,
  raw_ocr_text text,
  created_at timestamptz not null default now()
);

create index idx_inbody_records_measured_at on inbody_records (measured_at desc);

-- RLS: 개인용 오픈 정책 (Planner 앱과 동일한 방식)
alter table exercises enable row level security;
alter table workout_sessions enable row level security;
alter table workout_exercises enable row level security;
alter table workout_sets enable row level security;
alter table inbody_records enable row level security;

create policy "allow all - exercises" on exercises for all using (true) with check (true);
create policy "allow all - workout_sessions" on workout_sessions for all using (true) with check (true);
create policy "allow all - workout_exercises" on workout_exercises for all using (true) with check (true);
create policy "allow all - workout_sets" on workout_sets for all using (true) with check (true);
create policy "allow all - inbody_records" on inbody_records for all using (true) with check (true);

-- 종목 카탈로그 시드 데이터 (부족하면 앱에서 직접 추가 가능, is_custom=true로 저장됨)
insert into exercises (name, equipment_type, body_part) values
  ('벤치프레스','프리웨이트','가슴'), ('인클라인 벤치프레스','프리웨이트','가슴'),
  ('디클라인 벤치프레스','프리웨이트','가슴'), ('덤벨 벤치프레스','프리웨이트','가슴'),
  ('덤벨 플라이','프리웨이트','가슴'), ('딥스','맨몸','가슴'),
  ('체스트프레스 머신','머신','가슴'), ('펙덱 플라이','머신','가슴'), ('케이블 크로스오버','머신','가슴'),
  ('데드리프트','프리웨이트','등'), ('바벨로우','프리웨이트','등'), ('원암 덤벨로우','프리웨이트','등'),
  ('풀업','맨몸','등'), ('친업','맨몸','등'),
  ('랫풀다운','머신','등'), ('시티드 케이블 로우','머신','등'), ('T바로우','머신','등'),
  ('스쿼트','프리웨이트','하체'), ('프론트 스쿼트','프리웨이트','하체'), ('런지','프리웨이트','하체'),
  ('불가리안 스플릿 스쿼트','프리웨이트','하체'), ('힙 쓰러스트','프리웨이트','하체'),
  ('레그프레스','머신','하체'), ('레그컬','머신','하체'), ('레그익스텐션','머신','하체'),
  ('스미스머신 스쿼트','머신','하체'), ('힙 어브덕션 머신','머신','하체'), ('힙 어덕션 머신','머신','하체'),
  ('오버헤드프레스','프리웨이트','어깨'), ('덤벨 숄더프레스','프리웨이트','어깨'),
  ('사이드 레터럴 레이즈','프리웨이트','어깨'), ('프론트 레이즈','프리웨이트','어깨'),
  ('벤트오버 레터럴 레이즈','프리웨이트','어깨'),
  ('숄더프레스 머신','머신','어깨'), ('레터럴 레이즈 머신','머신','어깨'),
  ('바벨컬','프리웨이트','팔'), ('덤벨컬','프리웨이트','팔'), ('해머컬','프리웨이트','팔'),
  ('클로즈그립 벤치프레스','프리웨이트','팔'), ('스컬크러셔','프리웨이트','팔'), ('트라이셉스 킥백','프리웨이트','팔'),
  ('케이블컬','머신','팔'), ('트라이셉스 푸시다운','머신','팔'), ('이지바컬 머신','머신','팔'),
  ('플랭크','맨몸','코어'), ('크런치','맨몸','코어'), ('행잉 레그레이즈','맨몸','코어'),
  ('러시안 트위스트','맨몸','코어'), ('케이블 크런치','머신','코어');
