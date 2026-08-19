let userPhone = "";
let dailyLimit = 0;
let currentUsage = 0;


/* =========================
   CALCULATE PACKAGE
========================= */


async function calculateLimit() {

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const packageSize =
        Number(
            document.getElementById("package").value
        );

    const used =
        Number(
            document.getElementById("used").value
        );

    const days =
        Number(
            document.getElementById("days").value
        );


    if (!name || !phone) {

        alert(
            "Please enter your name and phone number."
        );

        return;
    }


    if (
        packageSize <= 0 ||
        used < 0 ||
        days <= 0 ||
        used > packageSize
    ) {

        alert(
            "Please enter valid package information."
        );

        return;
    }


    userPhone = phone;


    const button =
        document.getElementById(
            "calculateBtn"
        );


    button.disabled = true;

    button.innerHTML =
        "<span>Analyzing your package...</span>";


    try {

        const response =
            await fetch(
                "/calculate",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        package: packageSize,

                        used: used,

                        days_left: days

                    })

                }
            );


        const result =
            await response.json();


        dailyLimit =
            result.daily_limit;


        /* USER */

        document.getElementById(
            "userName"
        ).textContent =
            result.name;


        /* STATS */

        document.getElementById(
            "totalPackage"
        ).textContent =
            packageSize;


        document.getElementById(
            "remaining"
        ).textContent =
            result.remaining;


        document.getElementById(
            "remainingData"
        ).textContent =
            result.remaining;


        document.getElementById(
            "usedData"
        ).textContent =
            used;


        document.getElementById(
            "daysLeft"
        ).textContent =
            days;


        document.getElementById(
            "dailyLimit"
        ).textContent =
            result.daily_limit;


        /* PROGRESS */

        const percentage =
            Math.min(
                (used / packageSize) * 100,
                100
            );


        document.getElementById(
            "usagePercent"
        ).textContent =
            Math.round(percentage) + "%";


        setTimeout(() => {

            document.getElementById(
                "progressBar"
            ).style.width =
                percentage + "%";

        }, 100);


        /* SHOW DASHBOARD */

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        dashboard.classList.remove(
            "hidden"
        );


        dashboard.scrollIntoView({
            behavior: "smooth"
        });


    }

    catch (error) {

        alert(
            "Something went wrong. Please try again."
        );

        console.error(error);

    }


    button.disabled = false;

    button.innerHTML =
        "<span>Analyze My Package</span><span>→</span>";

}


/* =========================
   CHECK TODAY USAGE
========================= */


function checkUsage() {

    currentUsage =
        Number(
            document.getElementById(
                "todayUsage"
            ).value
        );


    const status =
        document.getElementById(
            "usageStatus"
        );


    const actionPanel =
        document.getElementById(
            "actionPanel"
        );


    if (
        isNaN(currentUsage) ||
        currentUsage < 0
    ) {

        alert(
            "Please enter today's usage."
        );

        return;
    }


    status.classList.remove(
        "hidden"
    );


    actionPanel.classList.remove(
        "hidden"
    );


    /* EXCEEDED */

    if (currentUsage > dailyLimit) {

        status.className =
            "status-card status-danger";


        status.innerHTML = `

            <strong>
                🔴 Daily Limit Exceeded
            </strong>

            <br>

            You used
            <b>${currentUsage} GB</b>
            today.

            <br>

            Your recommended limit is
            <b>${dailyLimit} GB/day</b>.

            <br><br>

            NetWise recommends activating
            data protection.

        `;


        /* automatic highlight */

        actionPanel.scrollIntoView({
            behavior: "smooth"
        });

    }


    /* SAFE */

    else {

        status.className =
            "status-card status-safe";


        status.innerHTML = `

            <strong>
                🟢 You're On Track
            </strong>

            <br>

            You used
            <b>${currentUsage} GB</b>
            today.

            <br>

            Your limit is
            <b>${dailyLimit} GB/day</b>.

            <br><br>

            Keep it up! Your package is
            under control.

        `;

    }

}


/* =========================
   BLOCK INTERNET
========================= */


async function blockInternet() {

    const resultBox =
        document.getElementById(
            "actionResult"
        );


    resultBox.innerHTML =
        "<p>Connecting to ISP...</p>";


    try {

        const response =
            await fetch(
                "/action/block",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        phone: userPhone

                    })

                }
            );


        const result =
            await response.json();


        resultBox.innerHTML = `

            <div class="result-blocked">

                <strong>
                    🔴 Internet Access Blocked
                </strong>

                <br><br>

                ${result.message}

                <br><br>

                <small>
                    ✓ Action sent to Mock ISP API
                </small>

            </div>

        `;

    }

    catch (error) {

        resultBox.innerHTML =
            "<p>Unable to execute action.</p>";

    }

}


/* =========================
   DATA SAVING MODE
========================= */


async function savingMode() {

    const resultBox =
        document.getElementById(
            "actionResult"
        );


    resultBox.innerHTML =
        "<p>Activating protection...</p>";


    try {

        const response =
            await fetch(
                "/action/saving-mode",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        phone: userPhone

                    })

                }
            );


        const result =
            await response.json();


        resultBox.innerHTML = `

            <div class="result-success">

                <strong>
                    🛡 Data Saving Mode Activated
                </strong>

                <br><br>

                ${result.message}

                <br><br>

                <small>
                    ✓ Action sent to Mock ISP API
                </small>

            </div>

        `;

    }

    catch (error) {

        resultBox.innerHTML =
            "<p>Unable to activate protection.</p>";

    }

}
