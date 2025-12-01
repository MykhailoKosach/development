// ================================
// MAP MODULE
// ================================

// Map popup functionality
(function() {
  const mapPointsData = {
    riasne: {
      title: "Рясне",
      text: "Складський комплекс класу B+ із сучасною інженерією та продуманою логістикою.",
      link: "riasne.html",
    },
    pidriasne: {
      title: "Підрясне",
      text: "Сучасний комплекс класу A, переобладнаний під виробничі потреби, площею 41 000 м².",
      link: "pidriasne.html",
    },
    zymna: {
      title: "Зимна Вода",
      text: "Складський комплекс класу A+ площею 116 000 м² у зручній локації на Кільцевій дорозі Львова.",
      link: "zymna-voda.html",
    },
    drohobych: {
      title: "Дрогобич",
      text: "Складський комплекс із потенціалом розвитку логістичної інфраструктури.",
      link: "#",
    },
  };

  const mapPopup = document.getElementById("mapPopup");
  const mapPopupClose = document.getElementById("mapPopupClose");
  const mapPopupTitle = document.getElementById("mapPopupTitle");
  const mapPopupText = document.getElementById("mapPopupText");
  const mapPopupLink = document.getElementById("mapPopupLink");

  if (mapPopup && mapPopupTitle && mapPopupText && mapPopupLink) {
    document.querySelectorAll(".map-point").forEach((point) => {
      point.addEventListener("click", () => {
        const key = point.getAttribute("data-location");
        const data = mapPointsData[key];
        if (!data) return;

        mapPopupTitle.textContent = data.title;
        mapPopupText.textContent = data.text;
        mapPopupLink.href = data.link;
        if (data.link === "#") {
          mapPopupLink.classList.add("disabled");
        } else {
          mapPopupLink.classList.remove("disabled");
        }
        mapPopup.classList.add("open");
      });
    });

    if (mapPopupClose) {
      mapPopupClose.addEventListener("click", () => {
        mapPopup.classList.remove("open");
      });
    }
  }
})();
