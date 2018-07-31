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
    
           this.get_sign(item);
        }
    },
    created() {
        this.test();
    }
};
</script>

