import { GitHubUser } from "./GitHubUser.js";

//logica
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favs:')) || [];
  }

  save() {
    localStorage.setItem('@github-favs:', JSON.stringify(this.entries));
  }

  async add(user) {
    try {
      const userFaved = this.entries.find(entry => user.toUpperCase() === entry.login.toUpperCase());
      if (userFaved) {
        throw new Error('Este usuário já está entre os favoritos!');
      }

      const newUser = await GitHubUser.search(user);

      if (newUser.login === undefined) {
        throw new Error('Usuário não encontrado.')
      }
    
      this.entries = [newUser, ...this.entries];
  
      this.update();
      this.save();

    } catch(error) {
      alert(error.message);
    }


  }

  delete(user) {
    let newEntries = [];
    this.entries.forEach(entry => {
      if (entry.login !== user) {
        newEntries = [...newEntries, entry];
      }
    })

    const isOk = confirm("Tem certeza de que quer desfavoritar esse usuário?");
    if (isOk) {
      this.entries = newEntries;
      this.update();
      this.save();
    }
  }

}

//html
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    
    this.addAUser();
    
  }
  
  update() {
    this.removeAllRows();
    
    this.createRows();
  }

  removeAllRows() {
    this.tbody.querySelectorAll("tr")
    .forEach(
      (row) => {
        row.remove();
      }
    )
  }

  createRows() {
    if (this.entries[0]) {
      this.entries.forEach(entry => 
      {
        const row = this.createARow();

        row.querySelector('.user a').href = `https://github.com/${entry.login}`;
        row.querySelector('.user img').alt = `Imagem de ${entry.name}` ;
        row.querySelector('.user img').src = `https://github.com/${entry.login}.png`;
        row.querySelector('.user a p').innerHTML = `<span>${entry.name}</span><br/>
        /${entry.login}`;
        row.querySelector('.repos').textContent = entry.public_repos;
        row.querySelector('.followers').textContent = entry.followers;

        this.tbody.append(row);

        row.querySelector('.action button').onclick = () => {
          this.delete(entry.login);
          this.update();
        }
      })
    } else {
      const emptySpace = this.createEmptyTable();
      this.tbody.append(emptySpace);
    }

  }

  createARow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td class="user">
              <a href="https://github.com/user" target="_blank">
                <img alt="Imagem de name" src="https://github.com/stelardn.png">
                <p><span>Name</span><br/>
                  /login
                </p>
              </a>
            </td>
            <td class="repos">0</td>
            <td class="followers">0</td>
            <td class="action">
              <button>
                Remover
              </button>
            </td>
    `
    return tr;
  }

  createEmptyTable() {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td colspan="4" class="empty-state">
     <div id="empty-state">
        <img src="img/star-empty.svg" alt="Desenho de uma estrela com uma expressão humana de surpresa.">
        <p>Nenhum favorito ainda</p>
      </div>
    </td>`

    return tr;
  }

  addAUser() {
    const addButton = this.root.querySelector('#fav-button');
    
    addButton.onclick = () => {
      const { value } = this.root.querySelector("#search-user");
      this.add(value);
      this.root.querySelector("#search-user").value = "";
    }
  }

}