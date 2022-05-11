# Wetube Reloaded

<!--
프로젝트를 만들기전 스케치하는 버릇을 기르자.

1. 무슨데이터를 쓸거야?
=> video + user (가장크게)
-->

<!-- global router => home(/)에서 갈수있으니까 -->

/ - Home
/join -> Join
/loign -> Login
/search -> Search

<!--
잘살펴보면 규칙에따르면 /users/login이 맞을거다 하지만. 궂이?
규칙은 있지만언제나 예외는 있다는것. 뭐가더 나은지는 본인이 잘 생각해보자
 -->

<!-- user router -->

/users/:id -> see user profile

<!-- 여기는 로그인한 유저만 가능한거니까 별도의 :id가 필요 x -->

/users/logout -> log out
/users/edit -> Edit my profile
/users/delete -> Delete my profile

<!-- video router -->

/videos/:id -> Watch Video
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video
/videos/upload -> Upload Video

/videos/comment -> comment on video
/videos/comment/delete -> comment on video delete

<!-- 이거랑 REST API가 관련있지않을까? -->
