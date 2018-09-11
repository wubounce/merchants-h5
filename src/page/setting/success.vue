<template>
    <section>
        <img src="../../../static/image/mine/success.png" alt="提交成功">
        <p class='first'>实名认证已提交</p>
        <p class='second'>审核结果请留意手机短信</p>
        <button @click='sure'>确认</button>
    </section>
</template>
<script>
export default {
    methods: {
        sure() {
            this.$router.replace({
                name: 'accountSet'
            });
        }
    }
};
</script>

<style lang='scss' scoped>
section {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #fff;
    img {
        width: 2rem;
        height: 2rem;
        margin: auto;
        display: block;
        padding-top: 3rem;
    }
    .first {
        text-align: center;
        color: #333333;
        font-size: 18px;
        margin-top: 1rem;
    }
    .second {
        color: #999999;
        font-size: 14px;
        text-align: center;
        margin-top: 0.5rem;
    }
    button {
        width: 2.8rem;
        font-size: 16px;
        height: 0.9rem;
        color: #1890FF;
        border: 1px solid rgba(24,144,255,1);
        background-color: #fff;
        border-radius: 5px;
        margin: 1.8rem auto;
        display: block;
    }
}
</style>

