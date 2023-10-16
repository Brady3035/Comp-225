<svelte:options tag= 'Map-button' />

<script>
    export let text = "map";
    function clickhandler(page){
        window.location.href = page;
    }
</script>

<button on:click={() => clickhandler('/Project/src/Map.html')}>
    {text}
</button>

<style>  
    button {
    display: inline-block;
    padding: 15px 30px;
    font-size: 20px;
    border: 5px solid #fff;
    border-radius: 20px;
    color: #a42222;
    text-decoration: none;
    margin-top: 20px;
    padding: 10px;
    transition: background-color 0.3s ease;
    }

</style>