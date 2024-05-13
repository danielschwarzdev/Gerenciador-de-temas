// Faz a requisição e armazena o JSON em localStorage
function storeJSONInLocalStorage() {
  const themesFile = "./themes.json";

  fetch(themesFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch JSON");
      }
      return response.json();
    })
    .then((json) => {
      localStorage.setItem("themes", JSON.stringify(json));
    })
    .catch((error) => {
      console.error(error);
    });
}

// Atualiza as cores do tema
function updateThemeColors(primaryColor, secondaryColor, successColor, dangerColor, warningColor) {
  document.body.style.setProperty("--primary-color", primaryColor);
  document.body.style.setProperty("--secondary-color", secondaryColor);
  document.body.style.setProperty("--success-color", successColor);
  document.body.style.setProperty("--danger-color", dangerColor);
  document.body.style.setProperty("--warning-color", warningColor);
}

// Preenche a lista com os temas existentes
function populateList(themes) {
  if (themes) {
    const themeList = document.getElementById("themes-list");
    let themeListHTML = "";

    themes.forEach((theme) => {
      themeListHTML += `
        <li>
          <a href="#" class="themes-list__item dropdown-item d-flex align-items-center gap-2 py-2" data-name="${theme.name}" data-primary-color="${theme.colors.primary}" data-secondary-color="${theme.colors.secondary}" data-success-color="${theme.colors.success}" data-danger-color="${theme.colors.danger}" data-warning-color="${theme.colors.warning}">
            <span class="d-inline-block rounded-circle p-1" style="background-color: ${theme.colors.primary}"></span>
            ${theme.name}
          </a>
        </li>
      `;
    });

    themeList.innerHTML = themeListHTML;
  }
}

// Filtra a lista preenchida anteriormente
function filterList() {
  const themeFilter = document.getElementById("theme-filter");
  themeFilter.addEventListener("input", () => {
    const searchText = themeFilter.value.toLowerCase();
    const themeItems = document.querySelectorAll("#themes-list li");

    // Iterar sobre os itens da lista
    themeItems.forEach((themeItem) => {
      const themeName = themeItem.textContent.toLowerCase();

      // Verificar se o texto do item da lista contém o texto digitado
      if (themeName.includes(searchText)) {
        themeItem.style.display = "block";
      } else {
        themeItem.style.display = "none";
      }
    });
  });
}

// Preenche a lacuna do hero com o nome do tema
function setThemeName(name) {
  const colorName = document.getElementById("theme-name");
  colorName.innerHTML = name;
}

// Altera o tema
function changeTheme() {
  const themeListItem = document.querySelectorAll(".themes-list__item");

  themeListItem.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const name = event.target.getAttribute("data-name");
      const primaryColor = event.target.getAttribute("data-primary-color");
      const secondaryColor = event.target.getAttribute("data-secondary-color");
      const successColor = event.target.getAttribute("data-success-color");
      const dangerColor = event.target.getAttribute("data-danger-color");
      const warningColor = event.target.getAttribute("data-warning-color");

      updateThemeColors(primaryColor, secondaryColor, successColor, dangerColor, warningColor);
      setThemeName(name);
    });
  });
}

// Preenche a tabela com os temas existentes
function populateTable(themes) {
  if (themes) {
    const themeTable = document.getElementById("themes-table");
    let themeTableHTML = "";

    themes.forEach((theme) => {
      themeTableHTML += `
      <tr>
        <th scope="row">${theme.id}</th>
        <td>${theme.name}</td>
        <td>${theme.colors.primary}</td>
        <td>${theme.colors.secondary}</td>
        <td>${theme.colors.success}</td>
        <td>${theme.colors.danger}</td>
        <td>${theme.colors.warning}</td>
        <td class="text-end">
          <a href="javascript:;" onclick="editItem(${theme.id})"><i class="bx bx-edit"></i></a>
          <a href="javascript:;" onclick="deleteItem(${theme.id})"><i class="bx bx-trash"></i></a>
        </td>
      </tr>
      `;
    });

    themeTable.innerHTML = themeTableHTML;
  }
}

// Inicializa as funções
const themes = JSON.parse(localStorage.getItem("themes"));
if (!themes) {
  storeJSONInLocalStorage();
}
updateThemeColors(
  themes[0].colors.primary,
  themes[0].colors.secondary,
  themes[0].colors.success,
  themes[0].colors.danger,
  themes[0].colors.warning
);
populateList(themes);
filterList();
setThemeName(themes[0].name);
changeTheme();
populateTable(themes);
