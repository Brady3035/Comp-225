<svelte:options tag='map-button' />
<script>
    function clickhandler(page){
        window.location.href = page;
    }
</script>

<button on:click={() => clickhandler('/BigDawGS-Project/src/Map.html')}>
    Map
</button>