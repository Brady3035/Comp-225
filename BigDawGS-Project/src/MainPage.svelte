<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="/BigDawGS-Project/public/Mainpage.css">
</head>

    <body style = "background-color: lightblue;">

        <img src = "/BigDawGS-Project/public/BigDawGS-logos.jpeg" class = logo>

        <h1>ProDawgTivity</h1>

        <p>Created by: BigDawGS</p> 

        <!-- /* divider for the button class hierarchy */ -->
        <div class="dawg-buttons">
        <!-- /* buttons n shit */ -->
            <a href="#" class="schedulebutt" onclick="redirectToPage('Schedule.html')">Schedule</a>
            <a href="#" class="dawgbutt" onclick="redirectToPage('Dawgs.html')">Dawgs</a>
            <a href="#" class="mapbutt" onclick="redirectToPage('Map.html')">Dawg Map</a>
            <a href="#" class="scorebutt" onclick="redirectToPage('Score.html')">Dawg Score</a>
        </div>

    
        <p>
            This program will get you goated at life.
        </p>

    <script>
        function redirectToPage(page) {
            window.location.href = page;
        }
    </script>
</body>

</html>
