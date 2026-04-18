with
user_data as (
  select id from auth.users where email = 'marc.gallacher10@gmail.com'
),
profile_insert as (
  insert into profiles (id) select id from user_data on conflict (id) do nothing returning id
),
r1 as (
  insert into rounds (user_id, course_name, date, tees, course_par, total_score, completed)
  select id, 'Gleneagles Kings', '2026-04-01', 'Yellow', 72, 89, true from user_data returning id
),
r2 as (
  insert into rounds (user_id, course_name, date, tees, course_par, total_score, completed)
  select id, 'St Andrews Links', '2026-04-05', 'White', 72, 86, true from user_data returning id
),
r3 as (
  insert into rounds (user_id, course_name, date, tees, course_par, total_score, completed)
  select id, 'Carnoustie', '2026-04-08', 'Yellow', 72, 91, true from user_data returning id
),
r4 as (
  insert into rounds (user_id, course_name, date, tees, course_par, total_score, completed)
  select id, 'Royal Troon', '2026-04-11', 'White', 71, 88, true from user_data returning id
),
r5 as (
  insert into rounds (user_id, course_name, date, tees, course_par, total_score, completed)
  select id, 'Muirfield', '2026-04-14', 'Yellow', 72, 84, true from user_data returning id
),
r6 as (
  insert into rounds (user_id, course_name, date, tees, course_par, total_score, completed)
  select id, 'Turnberry Ailsa', '2026-04-17', 'White', 72, 87, true from user_data returning id
),
h1 as (
  insert into holes (round_id, hole_number, par, score, putts, fairway_hit, green_in_regulation, penalties)
  select r1.id, h.hole_number, h.par, h.score, h.putts, h.fairway_hit, h.gir, h.pen from r1,
  (values (1,4,5,2,true,false,0),(2,4,4,2,true,true,0),(3,3,4,2,null,false,0),(4,5,6,2,false,false,1),(5,4,5,2,false,false,0),(6,3,4,3,null,false,0),(7,4,5,2,true,false,0),(8,4,4,1,true,true,0),(9,5,6,2,false,false,0),(10,4,5,2,false,false,0),(11,3,4,2,null,false,0),(12,4,4,2,true,true,0),(13,5,5,2,true,true,0),(14,4,6,3,false,false,1),(15,3,4,2,null,false,0),(16,4,5,2,false,false,0),(17,4,4,2,true,true,0),(18,5,7,3,false,false,1))
  as h(hole_number,par,score,putts,fairway_hit,gir,pen)
),
h2 as (
  insert into holes (round_id, hole_number, par, score, putts, fairway_hit, green_in_regulation, penalties)
  select r2.id, h.hole_number, h.par, h.score, h.putts, h.fairway_hit, h.gir, h.pen from r2,
  (values (1,4,5,2,true,false,0),(2,4,4,2,true,true,0),(3,3,3,1,null,true,0),(4,4,5,2,false,false,0),(5,5,6,2,true,false,0),(6,4,5,2,false,false,0),(7,4,4,2,true,true,0),(8,3,4,2,null,false,0),(9,4,5,2,false,false,0),(10,4,4,2,true,true,0),(11,3,3,1,null,true,0),(12,4,5,2,false,false,0),(13,4,4,2,true,true,0),(14,5,6,2,false,false,0),(15,4,5,2,false,false,0),(16,4,4,2,true,true,0),(17,4,5,2,false,false,0),(18,4,5,2,true,false,0))
  as h(hole_number,par,score,putts,fairway_hit,gir,pen)
),
h3 as (
  insert into holes (round_id, hole_number, par, score, putts, fairway_hit, green_in_regulation, penalties)
  select r3.id, h.hole_number, h.par, h.score, h.putts, h.fairway_hit, h.gir, h.pen from r3,
  (values (1,4,5,2,false,false,0),(2,4,6,3,false,false,1),(3,3,5,3,null,false,0),(4,4,5,2,false,false,0),(5,4,5,2,true,false,0),(6,5,6,2,true,false,0),(7,4,5,2,false,false,0),(8,3,4,2,null,false,0),(9,4,6,3,false,false,1),(10,4,5,2,false,false,0),(11,4,5,2,true,false,0),(12,3,4,2,null,false,0),(13,4,5,2,false,false,0),(14,5,7,3,false,false,1),(15,4,5,2,false,false,0),(16,3,4,2,null,false,0),(17,4,5,2,true,false,0),(18,5,5,2,true,true,0))
  as h(hole_number,par,score,putts,fairway_hit,gir,pen)
),
h4 as (
  insert into holes (round_id, hole_number, par, score, putts, fairway_hit, green_in_regulation, penalties)
  select r4.id, h.hole_number, h.par, h.score, h.putts, h.fairway_hit, h.gir, h.pen from r4,
  (values (1,4,5,2,true,false,0),(2,4,4,2,true,true,0),(3,4,5,2,false,false,0),(4,5,5,1,true,true,0),(5,3,4,2,null,false,0),(6,5,6,2,false,false,0),(7,4,5,2,false,false,0),(8,3,5,3,null,false,0),(9,4,5,2,false,false,0),(10,4,4,2,true,true,0),(11,4,5,2,false,false,0),(12,4,5,2,true,false,0),(13,3,4,2,null,false,0),(14,4,5,2,false,false,0),(15,4,4,2,true,true,0),(16,5,6,2,false,false,0),(17,3,4,2,null,false,0),(18,4,6,3,false,false,1))
  as h(hole_number,par,score,putts,fairway_hit,gir,pen)
),
h5 as (
  insert into holes (round_id, hole_number, par, score, putts, fairway_hit, green_in_regulation, penalties)
  select r5.id, h.hole_number, h.par, h.score, h.putts, h.fairway_hit, h.gir, h.pen from r5,
  (values (1,4,4,2,true,true,0),(2,4,5,2,true,false,0),(3,4,4,2,true,true,0),(4,3,3,1,null,true,0),(5,5,5,2,true,true,0),(6,4,5,2,false,false,0),(7,3,4,2,null,false,0),(8,4,4,2,true,true,0),(9,5,5,2,true,true,0),(10,4,5,2,false,false,0),(11,4,4,2,true,true,0),(12,4,5,2,false,false,0),(13,3,3,1,null,true,0),(14,4,5,2,false,false,0),(15,5,6,2,false,false,0),(16,4,4,2,true,true,0),(17,3,4,2,null,false,0),(18,4,5,2,true,false,0))
  as h(hole_number,par,score,putts,fairway_hit,gir,pen)
)
insert into holes (round_id, hole_number, par, score, putts, fairway_hit, green_in_regulation, penalties)
select r6.id, h.hole_number, h.par, h.score, h.putts, h.fairway_hit, h.gir, h.pen from r6,
(values (1,4,5,2,true,false,0),(2,4,4,2,true,true,0),(3,4,5,2,false,false,0),(4,3,4,2,null,false,0),(5,5,6,2,false,false,0),(6,4,5,2,true,false,0),(7,3,3,1,null,true,0),(8,4,5,2,false,false,0),(9,4,5,2,false,false,0),(10,4,4,2,true,true,0),(11,4,5,2,false,false,0),(12,3,4,2,null,false,0),(13,5,5,2,true,true,0),(14,4,5,2,false,false,0),(15,4,6,3,false,false,1),(16,3,4,2,null,false,0),(17,4,5,2,true,false,0),(18,5,7,3,false,false,1))
as h(hole_number,par,score,putts,fairway_hit,gir,pen);
