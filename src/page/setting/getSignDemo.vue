<template>
    <section >
        <p>sha1加密</p>
    </section>
</template>
<script>
import qs from "qs";
import { login } from '@/service/login';
export default {
    methods: {
        test() {
            let time = (new Date()).getTime();
            let item ={
                userName: '18948788872',
                password: '123456',
                _timestamp: time
            };
          
            //{
            //    userName: "18948788872", 
            //    password: "123456", 
            //    _timestamp: 1533021094042, 
            //    _sign: "1aed558fb59754fcba1f98d294c2749405374030"
            // }
            //函数返回一个对象，如上注释
           this.get_sign(item); 
        }
    },
    created() {
        this.test();
    }
};
</script>

