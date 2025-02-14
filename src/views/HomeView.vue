<template>
  <v-dialog v-model="filterTableModal" max-width="550">
    <v-card>
      <CustomBar
        text="Filtros da tabela"
        icon="mdi-content-save"
        :cleanBtn="true"
        @clearFunction="cleanTableFilter"
        @customFunction="useTableFilter"
      />
      <v-form>
        <v-card class="pa-6">
          <v-text-field
            v-model="solicitationFilter"
            variant="outlined"
            density="compact"
            label="Solicitação"
          />
          <v-text-field
            v-model="descriptionFilter"
            variant="outlined"
            density="compact"
            label="Descrição"
          />
          <v-text-field
            v-model="dateFilter"
            type="date"
            variant="outlined"
            density="compact"
            label="Data"
          />
          <v-text-field
            v-model="decisionFilter"
            variant="outlined"
            density="compact"
            label="Decisão"
          />
          <v-text-field
            v-model="reasonFilter"
            variant="outlined"
            density="compact"
            label="Motivo"
          />
        </v-card>
      </v-form>
    </v-card>
  </v-dialog>
  <div v-if="this.userProfiles != null">
    <div class="pageContentRow">
      <TextCustom margin="0px 0px 15px 0px" display="block">
        <p>
          Bem vindo ao <b>SisFlow</b>, o sistema de gestão de fluxos de estágios
          da FACOM.
        </p>
        <p>
          O sistema foi criado com a finalidade de facilitar as etapas
          relacionadas à gestão de estágios supervisionados fornecendo a
          possibilidade de realizar as solicitações às pessoas envolvidas no
          procedimento de forma centralizada e organizada.
        </p>
        <p v-if="this.userProfiles.includes('ADM')">
          Você está logado com uma conta de perfil administrador, abaixo você
          pode visualizar as solicitações de alunos ordenadas pela data de
          criação.
        </p>
        <p v-else-if="this.userProfiles.includes('COO')">
          Coordenador, abaixo você pode visualizar solicitações de alunos
          ordenadas primordialmente pela data de criação, está incluido também
          um recurso de busca.
        </p>
        <p v-else-if="this.userProfiles.includes('ADV')">
          Orientador, abaixo você pode visualizar solicitações de seus alunos
          orientados ordenadas pela data de criação.
        </p>
        <p v-else-if="this.userProfiles.includes('STU')">
          Você pode realizar solicitações no sistema para serem encaminhadas à
          coordenação de estágios e seu professor orientador.
        </p>
        <p v-else>
          Não se esqueça de verificar diariamente seu email institucional e/ou
          secundário após realizar solicitações.
        </p>
      </TextCustom>
    </div>

    <div
      class="pageContentRow"
      v-if="this.coordinatorSolTable['content'].length > 0"
    >
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar por qualquer campo da tabela"
        class="search-bar"
      />
      <div v-if="displayedTableData['content'].length > 0">
        <TextCustom
          customFontSize="title"
          margin="20px 0px 5px 0px"
          display="block"
        >
          Solicitações
        </TextCustom>
        <TableCustom class="tableC" :tableData="this.displayedTableData" />
      </div>
      <div v-else>
        <p>Nenhum resultado encontrado.</p>
      </div>
    </div>

    <div
      class="pageContentRow"
      v-if="this.advisorSolTable['content'].length > 0"
    >
      <TextCustom
        customFontSize="title"
        margin="20px 0px 5px 0px"
        display="block"
      >
        Solicitações de seus alunos orientados
      </TextCustom>

      <TableCustom class="tableC" :tableData="this.advisorSolTable" />
    </div>

    <div class="pageContentRow" v-if="this.allStudentSolTable.length > 0">
      <TextCustom
        customFontSize="title_bold"
        margin="20px 0px 5px 0px"
        display="block"
      >
        Suas solicitações
      </TextCustom>
      <CustomBar @customFunction="openFilterModal" icon="mdi-filter" />
      <CustomTableS :headers="headers" :items="studentSolTable"></CustomTableS>
      <!-- <TableCustom class="tableC" :tableData="this.studentSolTable" /> -->
    </div>

    <div class="solicitationBox" v-if="this.userProfiles.includes('STU')">
      <div class="solicitationBoxTitle">
        <TextCustom customFontSize="title_bold" display="block">
          Realizar Nova Solicitação
        </TextCustom>
        <TextCustom
          customFontSize="small"
          display="block"
          padding="10px"
          customColor="black2"
        >
          Realize uma solicitação às partes relacionadas selecionando o tipo e
          preenchendo os campos listados
        </TextCustom>
      </div>

      <div class="solicitationBoxItem">
        <div>
          <TextCustom
            customFontSize="normal"
            display="block"
            margin="5px 10px 0px 10px"
          >
            Tipo de solicitação
          </TextCustom>
          <SelectCustom
            id="solicitationTypeSelect"
            ref="solicitationTypeSelect"
            name="solicitationType"
            class="solicitationBoxSelect"
            placeholder="Selecione: "
            :items="this.solicitationTypes"
            @optClicked="
              (optValue) => {
                this.selectedSolType = optValue;
                this.handleOptsClick(true);
              }
            "
          />
        </div>
      </div>

      <div
        class="solicitationBoxItem"
        v-if="
          this.selectedSolType == 'Início de estágio obrigatório' ||
          this.selectedSolType == 'Início de estágio não obrigatório'
        "
      >
        <!--
        <div>
          <TextCustom customFontSize='normal' display="block" margin="5px 10px 0px 10px">
            Modalidade de estágio
          </TextCustom>
          <SelectCustom id="intershipLocalSelect" ref='intershipLocalSelect' name='intershipLocal'
            class="solicitationBoxSelect"
            placeholder="Selecione: "
            :items="this.intershipLocals"
            @optClicked="(optValue) => {this.intershipLocal=optValue; this.handleOptsClick();}"
          />
        </div>
        -->
        <div v-if="this.selectedSolType == 'Início de estágio obrigatório'">
          <TextCustom
            customFontSize="normal"
            display="block"
            margin="5px 10px 0px 10px"
          >
            Relação de trabalho
          </TextCustom>
          <SelectCustom
            id="employmentRelationshipSelect"
            ref="employmentRelationshipSelect"
            name="employmentRelationship"
            class="solicitationBoxSelect"
            placeholder="Selecione: "
            :items="this.employmentRelationships"
            @optClicked="
              (optValue) => {
                this.employmentRelationship = optValue;
                this.handleOptsClick();
              }
            "
          />
        </div>
      </div>

      <div class="solicitationBoxItem">
        <div class="btnWrapper">
          <div class="btn">
            <ButtonCustom
              id="btnSendSol"
              label="Iniciar"
              customTextColor="white"
              customBackColor="darkblue1"
              customFontSize="normal"
              width="150px"
              padding="3px 20px"
              :disabled="this.btnSendSolDisabled"
              @click="createSolicitation"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonCustom from "../components/ButtonCustom.vue";
import Requests from "../js/requests.js";
import SelectCustom from "../components/SelectCustom.vue";
import TableCustom from "../components/TableCustom.vue";
import CustomTableS from "../components/CustomTableS.vue";
import TextCustom from "../components/TextCustom.vue";
import CustomBar from "../components/CustomBar.vue";
//import Utils from '../js/utils.js'

export default {
  name: "HomeView",

  components: {
    ButtonCustom,
    SelectCustom,
    TableCustom,
    CustomTableS,
    CustomBar,
    TextCustom,
  },

  data() {
    return {
      userProfiles: null,
      searchTerm: "",

      filterTableModal: null,
      solicitationFilter: "",
      descriptionFilter: "",
      dateFilter: "",
      decisionFilter: "",
      reasonFilter: "",

      headers: [
        { title: "Solicitação", key: "solicitation_name", align: "center" },
        { title: "Descrição", key: "state_description", align: "center" },
        { title: "Data", key: "state_start_datetime", align: "center" },
        { title: "Decisão", key: "state_decision", align: "end" },
        { title: "Motivo", key: "state_reason", align: "center" },
        { title: "Ação", align: "center" },
      ],

      coordinatorSolTable: {
        titles: [
          "Aluno",
          "Orientador",
          "Solicitação",
          "Descrição",
          "Data",
          "Decisão",
          "Motivo",
          "Ação",
        ],
        colTypes: [
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "iconfunction",
        ],
        colWidths: ["11%", "10%", "15%", "25%", "10%", "11%", "11%", "7%"],
        content: [],
      },
      advisorSolTable: {
        titles: [
          "Aluno",
          "Solicitação",
          "Descrição",
          "Data",
          "Decisão",
          "Motivo",
          "Ação",
        ],
        colTypes: [
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "iconfunction",
        ],
        colWidths: ["11%", "15%", "30%", "10%", "15%", "12%", "7%"],
        content: [],
      },
      studentSolTable: [],
      allStudentSolTable: [],
      selectedSolType: null,
      employmentRelationship: null,
      intershipLocal: null,
      solicitationTypes: [
        {
          label: "Início de estágio obrigatório",
          value: "Início de estágio obrigatório",
        },
        {
          label: "Início de estágio não obrigatório",
          value: "Início de estágio não obrigatório",
        },
      ],
      employmentRelationships: [
        {
          label: "Com vínculo empregatício",
          value: "Com vínculo empregatício",
        },
        {
          label: "Sem vínculo empregatício",
          value: "Sem vínculo empregatício",
        },
      ],
      intershipLocals: [
        { label: "Externo", value: "Externo" },
        { label: "Interno", value: "Interno" },
      ],
      tableHeaders: [
        {
          title: "Solicitação",
          align: "center",
          key: "solicitation",
        },
        {
          title: "Descrição",
          align: "center",
          key: "description",
        },
        {
          title: "Data",
          align: "center",
          key: "date",
        },
        {
          title: "Decisão",
          align: "center",
          key: "decision",
        },
        {
          title: "Motivo",
          align: "center",
          key: "reason",
        },
        {
          title: "Ação",
          align: "center",
          key: "action",
        },
      ],
      btnSendSolDisabled: true,
    };
  },

  async created() {
    this.$root.pageName = "Solicitações";
    this.userProfiles = this.$root.userLoggedData["profile_acronyms"];
    this.user = this.$root.userLoggedData;

    if (
      this.userProfiles.includes("ADM") ||
      this.userProfiles.includes("COO")
    ) {
      await this.loadCoordinatorSolTable();
    } else if (this.userProfiles.includes("ADV")) {
      await this.loadAdvisorSolTable();
    } else if (this.userProfiles.includes("STU")) {
      await this.loadStudentSolTable();
    }
  },
  computed: {
    filteredData() {
      const search = this.searchTerm
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return this.coordinatorSolTable.content.filter((row) => {
        return Object.values(row).some((value) =>
          value
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(search)
        );
      });
    },
    displayedTableData() {
      return this.searchTerm
        ? { ...this.coordinatorSolTable, content: this.filteredData }
        : this.coordinatorSolTable;
    },
  },
  mounted() {},

  methods: {
    cleanTableFilter() {
      this.solicitationFilter = "";
      this.descriptionFilter = "";
      this.dateFilter = "";
      this.decisionFilter = "";
      this.studentSolTable = this.allStudentSolTable;
      this.filterTableModal = false;
    },

    useTableFilter() {
      if (
        !this.solicitationFilter &&
        !this.descriptionFilter &&
        !this.dateFilter &&
        !this.decisionFilter
      ) {
        this.studentSolTable = this.allStudentSolTable;
      }
      this.studentSolTable = this.allStudentSolTable?.filter((tableItem) => {
        return (
          tableItem?.solicitation_name
            .toLowerCase()
            .includes(this.solicitationFilter) &&
          tableItem?.state_description
            .toLowerCase()
            .includes(this.descriptionFilter) &&
          tableItem?.state_start_datetime.includes(
            this.dateFilter.replaceAll("-", "/")
          ) &&
          tableItem?.state_decision
            .toLowerCase()
            .includes(this.decisionFilter) &&
          tableItem?.state_reason.toLowerCase().includes(this.reasonFilter)
        );
      });
      this.filterTableModal = false;
    },
    openFilterModal() {
      this.filterTableModal = true;
    },
    async loadCoordinatorSolTable() {
      let vreturnCoor = await this.$root.doRequest(
        Requests.getCoordinatorSolicitations,
        []
      );

      if (vreturnCoor && vreturnCoor["ok"]) {
        let pageContext = this;
        pageContext.coordinatorSolTable["content"] = [];

        vreturnCoor["response"]["solicitations"].forEach((solicitation) => {
          solicitation["states"].forEach((state) => {
            // set icon name
            let iconName = null;
            // let iconNameTeste = null;
            if (
              state["state_profile_acronyms"] &&
              pageContext.userProfiles.includes("COO") &&
              state["state_profile_acronyms"].includes("COO") &&
              state["state_active"] &&
              state["state_decision"] == "Em analise"
            ) {
              iconName = "fa-solid fa-pencil";
              // iconNameTeste = "mdi-pencil";
            } else if (
              state["state_profile_acronyms"] &&
              pageContext.userProfiles.includes("ADV") &&
              state["state_profile_acronyms"].includes("ADV") &&
              this.user["user_name"] == solicitation["advisor_name"] &&
              state["state_active"] &&
              state["state_decision"] == "Em analise"
            ) {
              iconName = "fa-solid fa-pencil";
              // iconNameTeste = "mdi-pencil";
            } else if (
              !state["state_active"] ||
              !state["state_profile_acronyms"]
            ) {
              iconName = "fa-solid fa-eye";
              // iconNameTeste = "mdi-eye";
            }

            // load table data
            this.coordinatorSolTable["content"].push([
              solicitation["student_name"],
              solicitation["is_accepted_by_advisor"]
                ? solicitation["advisor_name"]
                : "---",
              solicitation["solicitation_name"],
              state["state_description"],
              state["state_start_datetime"]
                ? state["state_start_datetime"].replaceAll("-", "/")
                : "",
              state["state_decision"],
              state["state_reason"],
              {
                iconName: iconName,
                iconSelFunction: function () {
                  if (iconName) {
                    pageContext.$root.renderView(
                      state["state_static_page_name"]
                        ? state["state_static_page_name"]
                        : "solicitation",
                      { user_has_state_id: state["user_has_state_id"] }
                    );
                  }
                },
              },
            ]);
          });
        });
      } else {
        this.$root.renderRequestErrorMsg(vreturnCoor);
      }
    },

    async loadAdvisorSolTable() {
      let vreturnAdv = await this.$root.doRequest(
        Requests.getAdvisorSolicitations,
        []
      );

      if (vreturnAdv && vreturnAdv["ok"]) {
        let pageContext = this;
        pageContext.advisorSolTable["content"] = [];

        vreturnAdv["response"]["solicitations"].forEach((solicitation) => {
          solicitation["states"].forEach((state) => {
            // set icon name
            let iconName = null;
            // let iconNameTeste = null;
            if (
              state["state_profile_acronyms"] &&
              pageContext.userProfiles.includes("ADV") &&
              state["state_profile_acronyms"].includes("ADV")
            ) {
              if (
                state["state_active"] &&
                state["state_decision"] == "Em analise"
              ) {
                iconName = "fa-solid fa-pencil";
                // iconNameTeste = "mdi-pencil";
              } else {
                iconName = "fa-solid fa-eye";
                // iconNameTeste = "mdi-eye";
              }
            } else if (!state["state_profile_acronyms"]) {
              iconName = "fa-solid fa-eye";
              // iconNameTeste = "mdi-eye";
            }

            // load table data
            this.advisorSolTable["content"].push([
              solicitation["student_name"],
              solicitation["solicitation_name"],
              state["state_description"],
              state["state_start_datetime"]
                ? state["state_start_datetime"].replaceAll("-", "/")
                : "",
              state["state_decision"],
              state["state_reason"],
              {
                iconName: iconName,
                iconSelFunction: function () {
                  if (iconName) {
                    pageContext.$root.renderView(
                      state["state_static_page_name"]
                        ? state["state_static_page_name"]
                        : "solicitation",
                      { user_has_state_id: state["user_has_state_id"] }
                    );
                  }
                },
              },
            ]);
          });
        });
      } else {
        this.$root.renderRequestErrorMsg(vreturnAdv);
      }
    },

    async loadStudentSolTable() {
      let vreturnStud = await this.$root.doRequest(
        Requests.getStudentSolicitations,
        []
      );

      if (vreturnStud && vreturnStud["ok"]) {
        let pageContext = this;
        pageContext.studentSolTable["content"] = [];
        console.log("pageContext: ", pageContext);

        vreturnStud["response"]["solicitations"].forEach((solicitation) => {
          solicitation["states"].forEach((state) => {
            // set icon name
            let iconName = null;
            if (
              state["state_profile_acronyms"] &&
              pageContext.userProfiles.includes("STU") &&
              state["state_profile_acronyms"].includes("STU")
            ) {
              if (
                state["state_active"] &&
                state["state_decision"] == "Em analise"
              ) {
                iconName = "mdi-pencil";
              } else {
                iconName = "mdi-eye";
              }
            } else if (!state["state_profile_acronyms"]) {
              iconName = "mdi-eye";
            }

            // load table data
            // this.studentSolTable["content"].push([
            //   solicitation["solicitation_name"],
            //   state["state_description"],
            //   state["state_start_datetime"]
            //     ? state["state_start_datetime"].replaceAll("-", "/")
            //     : "",
            //   state["state_decision"],
            //   state["state_reason"],
            //   {
            //     iconName: iconName,
            //     iconSelFunction: function () {
            //       if (iconName) {
            //         pageContext.$root.renderView(
            //           state["state_static_page_name"]
            //             ? state["state_static_page_name"]
            //             : "solicitation",
            //           { user_has_state_id: state["user_has_state_id"] }
            //         );
            //       }
            //     },
            //   },
            // ]);

            const studentSolTableEntry = {
              solicitation_name: solicitation.solicitation_name,
              state_description: state.state_description,
              state_start_datetime: state.state_start_datetime
                ? state.state_start_datetime.replaceAll("-", "/")
                : "",
              state_decision: state.state_decision,
              state_reason: state.state_reason,
              icon: iconName,
              actionFunction: function () {
                if (iconName) {
                  pageContext.$root.renderView(
                    state["state_static_page_name"]
                      ? state["state_static_page_name"]
                      : "solicitation",
                    { user_has_state_id: state["user_has_state_id"] }
                  );
                }
              },
            };

            this.allStudentSolTable.push(studentSolTableEntry);
          });
        });
        this.studentSolTable = this.allStudentSolTable;
      } else {
        this.$root.renderRequestErrorMsg(vreturnStud);
      }
    },

    handleOptsClick(restartValues = false) {
      if (restartValues) {
        this.employmentRelationship = null;
        this.intershipLocal = null;
        if (this.$refs.intershipLocalSelect) {
          this.$refs.intershipLocalSelect.setV(null);
        }
        if (this.$refs.employmentRelationshipSelect) {
          this.$refs.employmentRelationshipSelect.setV(null);
        }
      }

      if (
        this.selectedSolType == "Início de estágio obrigatório" &&
        this.employmentRelationship != null
      ) {
        this.btnSendSolDisabled = false;
      } else if (this.selectedSolType == "Início de estágio não obrigatório") {
        this.btnSendSolDisabled = false;
      } else {
        this.btnSendSolDisabled = true;
      }
    },

    async createSolicitation() {
      let solicitationId = null;
      if (
        this.selectedSolType == "Início de estágio obrigatório" &&
        this.employmentRelationship != null
      ) {
        if (this.employmentRelationship == "Com vínculo empregatício") {
          solicitationId = 1;
        } else {
          solicitationId = 2;
        }
      } else if (this.selectedSolType == "Início de estágio não obrigatório") {
        solicitationId = 3;
      } else {
        this.$root.renderMsg("warn", "Solicitação inválida!", "");
        return;
      }

      let vreturn = await this.$root.doRequest(Requests.putSolicitation, [
        solicitationId,
      ]);

      if (vreturn && vreturn["ok"]) {
        this.$root.renderView("solicitation", {
          user_has_state_id: vreturn["response"]["user_has_state_id"],
        });
      } else {
        this.$root.renderRequestErrorMsg(vreturn, [
          "Dados da solicitação não encontrados",
          "Você já possui essa solicitação",
          "Erro ao criar a solicitação do usuário",
          "Erro ao criar o estado da solicitação do usuário",
        ]);
      }
    },
  },
};
</script>

<!-- style applies only to this component -->
<style scoped>
:deep(.v-input) .v-input__control input[type="date"] {
  display: inline-block;
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border-radius: 6px;
  border: 1px solid var(--color-gray2);
}

.pageContentRow {
  margin-bottom: 40px;
}
.textC,
.tableC {
  margin-top: 5px;
}
.btnWrapper {
  display: block;
  width: 100%;
}
.btn,
.btnWrapper {
  border: none;
  outline: none;
}
.radioSolicitation {
  margin: 20px 0px;
}
.solicitationBox {
  border: 1px solid var(--color-gray2);
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.2) -1px 1px 1px;
  position: relative;
  display: inline-block;
  text-align: left;
  width: 100%;
}
.solicitationBoxTitle {
  background-color: var(--color-gray1);
  border-bottom: 0.5px solid var(--color-gray2);
  color: var(--color-black2);
  padding: 15px;
}
.solicitationBoxItem {
  border-bottom: 0.5px solid var(--color-gray2);
  color: var(--color-black2);
  padding: 5px;
}
.solicitationBoxLabel,
.solicitationBoxSelect {
  margin: 5px 10px;
  width: 300px;
}
@media (min-width: 900px) {
  .btnWrapper {
    text-align: right;
  }
  .btn {
    display: inline-block;
  }
}
@media (max-width: 900px) {
  .btnWrapper {
    text-align: center;
  }
  .btn {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
