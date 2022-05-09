// const express = require('express')
import express from 'express';
//babel덕분에 es6문법인 import를 쓸수있다 => low버전으로 컴파일해줄테니까 그럼 그 컴파일된 버전의 js를 노드가 알아먹을거니까
const app = express();

console.log('hello nodeJS aa') 

//그럼 코드바뀔때마다 원하는 pacakge.json script로 실행해가면서 확인해야겠네? => no nodemon을 이용하면됨
//nodemon은 파일의 변화를 감지해서 자동으로 재시작해주는 패키지다 'nodemon 입력어' => node 가 아닌 babel node로 실행하고있다는거를 기억하자