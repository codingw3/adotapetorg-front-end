import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Pagination,
  Row,
} from "react-bootstrap";
import {
  AiFillIdcard,
  AiOutlineInfoCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { RxSize } from "react-icons/rx";
import {
  BsCalendarEvent,
  BsGenderFemale,
  BsGenderMale,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import {
  CarregamentoBotao,
  CarregamentoLista,
} from "../../components/Carregamento";
import {
  FALSE_PHP,
  MENSAGEM_NENHUM_PET_CADASTRADO,
  PRIMEIRA_PAGINA,
  REGISTROS_PAGINACAO,
  TELA_EDITAR_PERFIL_USUARIO,
  TIPO_ALERTA,
  TIPO_SUCESSO,
  TRUE_PHP,
} from "../../components/Constantes";
import TituloPagina from "../../components/TituloPagina";
import NavLinkToTop from "../../components/navLinkToTop/NavLinkToTop";
import { AuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import Api from "../../services/Api";
import {
  formataMostrandoIdade,
  formataPrimeiroNome,
  formataSexoPet,
  formataTamanhoPet,
} from "../../utils/Mask";
import { verificaLista } from "../../utils/Util";
import { GrConfigure } from "react-icons/gr";

export default function PetUsuarioLogado() {
  const { token, usuarioLogado } = useContext(AuthContext);
  const { setarMensagem } = useContext(MessageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [listaPets, setListaPets] = useState([]);
  const [listaPetTipos, setListaPetTipos] = useState([]);
  const [carregandoRacas, setCarregandoRacas] = useState(true);
  const [listaRacas, setListaRacas] = useState([]);
  const [listaCores, setListaCores] = useState([]);
  const [selectedCores, setSelectedCores] = useState([]);
  const [disabledCores, setDisabledCores] = useState([]);
  const [selectedCoresNomes, setSelectedCoresNomes] = useState([]);
  const [idPet, setIdPet] = useState(0);
  const [tipo, setTipo] = useState(0);
  const [raca, setRaca] = useState(0);
  const [cor, setCor] = useState(0);
  const [imagem, setImagem] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [tamanho, setTamanho] = useState("0");
  const [flgNecessidadesEspeciais, setFlgNecessidadesEspeciais] =
    useState(false);
  const [sexo, setSexo] = useState("0");
  const [flgAdotado, setFlgAdotado] = useState(false);
  const [necessidadesEspeciais, setNecessidadesEspeciais] = useState("");
  const [modoEditar, setModoEditar] = useState(false);
  const [abrirModalCadastrarPet, setAbrirModalCadastrarPet] = useState(false);
  const [abrirModalEditarImagem, setAbrirModalEditarImagem] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [dataPet, setDataPet] = useState([]);

  useEffect(() => {
    listarPetsUsuarioLogado(pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const headerMultipart = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  function listarPetsUsuarioLogado(numeroPagina) {
    setIsLoading(true);
    setPagina(numeroPagina);

    Api.get(`pets/cadastrados/user?page=${pagina}`, header)
      .then(({ data }) => {
        setDataPet(data.pets);
        setListaPets(data.pets.data);
        setListaPetTipos(data.tipos);
        setListaRacas(data.racas);
        setListaCores(data.cores);
        limparCampos();
      })
      .catch(({ response }) => {
        setListaPets(null);
        setarMensagem(response.data.message, null);
        setListaPetTipos(response.data.tipos);
        setListaCores(response.data.cores);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function limparCampos() {
    setTipo(0);
    setRaca(0);
    setCor(0);

    setNome("");
    setSexo("0");
    setImagem("");
    setApelido("");
    setTamanho("0");
    setDataNascimento("");
    setNecessidadesEspeciais("");

    setFlgAdotado(false);
    setFlgNecessidadesEspeciais(false);
    setAbrirModalCadastrarPet(false);
    setAbrirModalEditarImagem(false);
    setModoEditar(false);

    setSelectedCoresNomes([]);
    setSelectedCores([]);
    setDisabledCores([]);
  }

  function validaCampos() {
    if (tipo === null || tipo === 0) {
      setarMensagem("Selecione um tipo", null);
      return false;
    }

    if (raca === null || raca === 0) {
      setarMensagem("Selecione uma raça", null);
      return false;
    }

    if (verificaLista(selectedCores)) {
      setarMensagem("Selecione pelo menos uma cor", null);
      return false;
    }

    if (imagem === "" || imagem === null) {
      setarMensagem("Selecione uma foto", null);
      return false;
    }

    if (nome === "" || nome === null) {
      setarMensagem("Preencha o campo nome", null);
      return false;
    }

    if (dataNascimento === "" || dataNascimento === null) {
      setarMensagem("Preencha o campo data nascimento", null);
      return false;
    }

    if (
      flgNecessidadesEspeciais === true &&
      (necessidadesEspeciais === null || necessidadesEspeciais === "")
    ) {
      setarMensagem("Preencha o campo necessidades especiais", null);
      return false;
    }

    if (tamanho === "0" || tamanho === null) {
      setarMensagem("Selecione um tamanho", null);
      return false;
    }

    if (sexo === "0" || sexo === null) {
      setarMensagem("Selecione um sexo", null);
      return false;
    }

    return true;
  }

  function cadastrarEditarPet(e) {
    e.preventDefault();

    if (validaCampos()) {
      setIsLoading(true);
      let flgAdotadoValidado = flgAdotado === true ? TRUE_PHP : FALSE_PHP;
      let flgNecessidadesEspeciaisValidado =
        flgNecessidadesEspeciais === true ? TRUE_PHP : FALSE_PHP;

      let request = {
        user_id: usuarioLogado.id,
        pet_tipos_id: tipo,
        nome: nome,
        apelido: apelido,
        raca_id: raca,
        data_nascimento: dataNascimento,
        cores: selectedCoresNomes.length > 0 ? selectedCoresNomes : null,
        imagem: imagem,
        tamanho: tamanho,
        flg_necessidades_especiais: flgNecessidadesEspeciaisValidado,
        necessidades_especiais:
          flgNecessidadesEspeciais === true ? necessidadesEspeciais : null,
        sexo: sexo,
        flg_adotado: modoEditar ? flgAdotadoValidado : null,
        flg_ativo: modoEditar ? TRUE_PHP : null,
      };

      Api.post(modoEditar ? `pets/${idPet}` : "pets", request, headerMultipart)
        .then(({ data }) => {
          setarMensagem(data.message, TIPO_SUCESSO);
        })
        .catch(({ response }) => {
          setarMensagem(response.data.message, null);
        })
        .finally(() => {
          listarPetsUsuarioLogado();
        });
    }
  }

  function deletarPet(idPet) {
    setIsLoading(true);
    Api.post(`pets/deletar/${idPet}`, null, header)
      .then(({ data }) => {
        setarMensagem(data.message, TIPO_SUCESSO);
      })
      .catch(({ response }) => {
        setarMensagem(response.data.message, null);
      })
      .finally(() => {
        listarPetsUsuarioLogado();
      });
  }

  function listarRacas(idPetTipo) {
    setCarregandoRacas(true);
    Api.post(`pets/racas/${idPetTipo}`, null, header)
      .then(({ data }) => {
        setListaRacas(data);
      })
      .catch(({ response }) => {
        setarMensagem(response.data.message, null);
      })
      .finally(() => {
        setCarregandoRacas(false);
      });
  }

  const handleSelectTipoPet = (e) => {
    setRaca(0);
    setTipo(e.target.value);
    const valueSelectedInteger = parseInt(e.target.value);
    listarRacas(valueSelectedInteger);
  };

  function visualizarEditarPet(pet) {
    setModoEditar(true);
    listarRacas(pet.pet_tipos_id);

    setIdPet(pet.id);
    setNome(pet.nome);
    setRaca(pet.raca_id);
    setTamanho(pet.tamanho);
    setImagem(pet.imagem);
    setSexo(pet.sexo);
    setTipo(pet.pet_tipos_id);
    setApelido(pet.apelido);
    setDataNascimento(pet.data_nascimento);
    setFlgAdotado(pet.flg_adotado);

    let listaCoresNomes = [];

    if (pet.cores != null && pet.cores.length > 0) {
      listaCoresNomes = pet.cores.map((cor) => cor.cor);
    }

    setSelectedCoresNomes(listaCoresNomes);
    setSelectedCores(pet.cores);
    setDisabledCores(pet.cores);

    setFlgNecessidadesEspeciais(
      pet.flg_necessidades_especiais === TRUE_PHP ? true : false
    );
    setNecessidadesEspeciais(
      pet.necessidades_especiais === null ? "" : pet.flg_necessidades_especiais
    );
    setAbrirModalCadastrarPet(true);
  }

  function removerImagemPet(idPet) {
    setIsLoading(true);
    Api.post(`pets/deletar/imagem/${idPet}`, null, header)
      .then(({ data }) => {
        setarMensagem(data.message, TIPO_SUCESSO);
        limparCampos();
      })
      .catch(({ response }) => {
        setarMensagem(response.data.message, null);
      })
      .finally(() => {
        listarPetsUsuarioLogado();
        setIsLoading(false);
      });
  }

  function validaCamposAtualizaImagem() {
    if (imagem === "" || imagem === null) {
      setarMensagem("Selecione uma imagem", null);
      return false;
    }

    return true;
  }

  function editarImagem() {
    window.scrollTo(0, 0);

    if (validaCamposAtualizaImagem()) {
      setIsLoadingButton(true);

      let request = {
        imagem: imagem,
      };

      Api.post(`pets/atualizar/imagem/${idPet}`, request, headerMultipart)
        .then(({ data }) => {
          setarMensagem(data.message, TIPO_SUCESSO);
          limparCampos();
        })
        .catch(({ response }) => {
          setarMensagem(response.data.message, null);
        })
        .finally(() => {
          setIsLoadingButton(false);
          listarPetsUsuarioLogado();
        });
    }
  }

  const handleOptionSelectCor = (event) => {
    const selectedCorId = parseInt(event.target.value, 10);
    const selectedCor = listaCores.find((cor) => cor.id === selectedCorId);

    setSelectedCores([...selectedCores, selectedCor]);
    setDisabledCores([...disabledCores, selectedCor]);
    setSelectedCoresNomes([...selectedCoresNomes, selectedCor.cor]);
  };

  const handleRemoveCor = (corId) => {
    const updatedSelectedCores = selectedCores.filter(
      (cor) => cor.id !== corId
    );
    const updatedDisabledCores = disabledCores.filter(
      (cor) => cor.id !== corId
    );

    let listaCoresNomes = [];

    if (updatedSelectedCores != null && updatedSelectedCores.length > 0) {
      listaCoresNomes = updatedSelectedCores.map((cor) => cor.cor);
    }

    setSelectedCores(updatedSelectedCores);
    setDisabledCores(updatedDisabledCores);
    setSelectedCoresNomes(listaCoresNomes);
  };

  return (
    <>
      <TituloPagina titulo="Meus Pets" />

      {usuarioLogado.celular === null && usuarioLogado.telefone === null && (
        <p>
          Para começar a cadastrar, é necessário completar seu perfil,{" "}
          <NavLinkToTop to={TELA_EDITAR_PERFIL_USUARIO}>
            clicando aqui
          </NavLinkToTop>
          .
        </p>
      )}

      <button
        className={`btn btn-warning d-flex justify-content-center align-items-center gap-1 mb-3 fw-bold ${
          usuarioLogado.celular === null && usuarioLogado.telefone === null
            ? "disabled"
            : ""
        }`}
        onClick={() => setAbrirModalCadastrarPet(true)}
      >
        <AiOutlinePlus /> Cadastrar pet
      </button>

      {isLoading ? (
        <CarregamentoLista />
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {verificaLista(listaPets) ? (
              <div className="mb-3">{MENSAGEM_NENHUM_PET_CADASTRADO}</div>
            ) : (
              <>
                {listaPets.map((pet) => (
                  <Col key={pet.id}>
                    <Card>
                      <div className="image-container">
                        <Card.Img
                          variant="top"
                          src={process.env.REACT_APP_API_URL + pet.imagem}
                          alt={`Foto do pet ${pet.nome}`}
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>
                          {pet.flg_adotado === FALSE_PHP ? (
                            <Badge
                              pill
                              bg={TIPO_ALERTA}
                              className="text-dark mb-2"
                            >
                              Para adoção
                            </Badge>
                          ) : (
                            <Badge
                              pill
                              bg={TIPO_SUCESSO}
                              className="text-dark mb-2"
                            >
                              Adotado
                            </Badge>
                          )}
                          <br />
                          <AiFillIdcard /> {formataPrimeiroNome(pet.nome)}{" "}
                          {pet.apelido !== null && `(${pet.apelido})`}
                        </Card.Title>
                        <Card.Text>
                          <RxSize /> {formataTamanhoPet(pet.tamanho, pet.sexo)}{" "}
                          <br />
                          <span
                            className={
                              pet.sexo === "M" ? "text-primary" : "text-danger"
                            }
                          >
                            {pet.sexo === "M" ? (
                              <BsGenderMale />
                            ) : (
                              <BsGenderFemale />
                            )}{" "}
                            {formataSexoPet(pet.sexo)}
                          </span>{" "}
                          <br />
                          <BsCalendarEvent />{" "}
                          {formataMostrandoIdade(pet.data_nascimento)} <br />
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="d-flex justify-content-between align-items-center">
                        <div>
                          <NavLinkToTop
                            className="btn btn-primary d-flex justify-content-center align-items-center gap-1"
                            to={`/informacoes/pet/${pet.id}`}
                          >
                            <AiOutlineInfoCircle /> Info
                          </NavLinkToTop>
                        </div>

                        <div>
                          <Dropdown>
                            <Dropdown.Toggle className="btn btn-light d-flex justify-content-center align-items-center gap-1">
                              <GrConfigure /> Ações
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Button
                                className="dropdown-item"
                                onClick={() => {
                                  visualizarEditarPet(pet);
                                }}
                              >
                                <BsPencil /> Editar Pet
                              </Button>

                              <Button
                                className="dropdown-item"
                                onClick={() => {
                                  let result = window.confirm(
                                    "Confirma a ação DELETAR PET?"
                                  );
                                  if (result) deletarPet(pet.id);
                                }}
                              >
                                <BsTrash /> Deletar Pet
                              </Button>

                              <Button
                                className="dropdown-item"
                                onClick={() => {
                                  setImagem("");
                                  setIdPet(pet.id);
                                  setAbrirModalEditarImagem(true);
                                }}
                              >
                                <BsPencil /> Editar Imagem
                              </Button>

                              <Button
                                className="dropdown-item"
                                onClick={() => {
                                  let result = window.confirm(
                                    "Confirma a ação REMOVER IMAGEM?"
                                  );
                                  if (result) removerImagemPet(pet.id);
                                }}
                              >
                                <BsTrash /> Remover Imagem
                              </Button>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </>
            )}
          </Row>

          {!verificaLista(listaPets) &&
            dataPet.total >= REGISTROS_PAGINACAO && (
              <Row className="my-3">
                <Pagination className="d-flex justify-content-center align-items-center">
                  {/* BOTÃO DE VOLTAR PARA A PRIMEIRA PÁGINA */}
                  <Pagination.First
                    disabled={dataPet.current_page === PRIMEIRA_PAGINA}
                    onClick={() => listarPetsUsuarioLogado(dataPet.first_page)}
                  />

                  {/* BOTÃO DE VOLTAR PARA A PÁGINA */}
                  <Pagination.Prev
                    disabled={dataPet.current_page === PRIMEIRA_PAGINA}
                    onClick={() =>
                      listarPetsUsuarioLogado(dataPet.current_page - 1)
                    }
                  />

                  {/* PARA MOSTRAR QUE EXISTE MAIS PÁGINA ANTERIORES */}
                  {dataPet.current_page > 2 && <Pagination.Ellipsis disabled />}

                  {/* PÁGINA ATUAL MENOS UM */}
                  {dataPet.current_page >= 2 && (
                    <Pagination.Item
                      onClick={() =>
                        listarPetsUsuarioLogado(dataPet.current_page - 1)
                      }
                    >
                      {dataPet.current_page - 1}
                    </Pagination.Item>
                  )}

                  {/* PÁGINA ATUAL */}
                  <Pagination.Item active>
                    {dataPet.current_page}
                  </Pagination.Item>

                  {/* PÁGINA ATUAL MAIS UM */}
                  {dataPet.current_page + 1 <= dataPet.last_page && (
                    <Pagination.Item
                      onClick={() =>
                        listarPetsUsuarioLogado(dataPet.current_page + 1)
                      }
                    >
                      {dataPet.current_page + 1}
                    </Pagination.Item>
                  )}

                  {/* PARA MOSTRAR QUE EXISTE MAIS PRÓXIMAS PÁGINAS */}
                  {dataPet.current_page + 1 < dataPet.last_page && (
                    <Pagination.Ellipsis disabled />
                  )}

                  {/* BOTÃO DE IR PARA A PRÓXIMA PÁGINA */}
                  <Pagination.Next
                    disabled={dataPet.current_page === dataPet.last_page}
                    onClick={() =>
                      listarPetsUsuarioLogado(dataPet.current_page + 1)
                    }
                  />

                  {/* BOTÃO DE IR PARA A ÚLTIMA PÁGINA */}
                  <Pagination.Last
                    disabled={dataPet.current_page === dataPet.last_page}
                    onClick={() => listarPetsUsuarioLogado(dataPet.last_page)}
                  />
                </Pagination>
              </Row>
            )}

          {/* MODAL CADASTRAR EDITAR PET */}
          <Modal show={abrirModalCadastrarPet} onHide={limparCampos}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold text-primary">
                {modoEditar ? "Editar" : "Cadastrar"} Pet
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {modoEditar && (
                  <Form.Check
                    className="mb-3"
                    onChange={() => setFlgAdotado(!flgAdotado)}
                    checked={flgAdotado}
                    variant="secondary"
                    id="flgAdotado"
                    label="O pet foi adotado?"
                  ></Form.Check>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="raca">
                    Tipo
                  </Form.Label>
                  <Form.Select
                    onChange={handleSelectTipoPet}
                    value={tipo}
                    id="tipo"
                  >
                    <option value="0" className="fw-bold" disabled>
                      Selecione um tipo
                    </option>

                    {listaPetTipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id} name={tipo.tipo}>
                        {tipo.tipo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="raca">
                    Raça
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => setRaca(e.target.value)}
                    value={raca}
                    id="raca"
                    disabled={tipo === 0 ? true : false}
                  >
                    <option value="0" className="fw-bold" disabled>
                      Selecione um tipo
                    </option>

                    {carregandoRacas && (
                      <option value="0" className="fw-bold" disabled>
                        Carregando raças...
                      </option>
                    )}

                    {!verificaLista(listaRacas) &&
                      listaRacas.map((raca) => (
                        <option key={raca.id} value={raca.id} name={raca.raca}>
                          {raca.raca}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="cor">
                    Cor
                  </Form.Label>
                  <Form.Select
                    className="mb-3"
                    onChange={handleOptionSelectCor}
                    value={cor}
                    id="cor"
                  >
                    <option value="0" className="fw-bold" disabled>
                      Selecione uma ou mais cores
                    </option>

                    {listaCores.map((cor) => (
                      <option
                        key={cor.id}
                        value={cor.id}
                        disabled={disabledCores.some(
                          (disabledTag) => disabledTag.id === cor.id
                        )}
                      >
                        {cor.cor}
                      </option>
                    ))}
                  </Form.Select>

                  {!verificaLista(selectedCores) && (
                    <>
                      <Form.Label className="fw-bold" htmlFor="cor">
                        Cores Selecionadas
                      </Form.Label>

                      <div className="mb-3">
                        {selectedCores.map((cor) => (
                          <button
                            key={cor.id}
                            type="button"
                            className="btn btn-primary m-1"
                            onClick={() => handleRemoveCor(cor.id)}
                          >
                            {cor.cor} <span className="badge">x</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </Form.Group>

                {!modoEditar && (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold" htmlFor="imagem">
                      Imagem
                    </Form.Label>
                    <Form.Control
                      id="imagem"
                      type="file"
                      onChange={(e) => setImagem(e.target.files[0])}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="nome">
                    Nome
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome do Pet"
                    autoFocus
                    id="nome"
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="apelido">
                    Apelido
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apelido do Pet"
                    id="apelido"
                    onChange={(e) => setApelido(e.target.value)}
                    value={apelido}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className="text-muted">
                    Se não souber a data exata de nascimento, pode colocar uma
                    data próxima da idade que o Pet tem.
                  </p>
                  <Form.Label className="fw-bold" htmlFor="dataNascimento">
                    Data nascimento
                  </Form.Label>
                  <Form.Control
                    id="dataNascimento"
                    type="date"
                    value={dataNascimento}
                    required
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </Form.Group>

                <Form.Check
                  className="mb-3"
                  onChange={() =>
                    setFlgNecessidadesEspeciais(!flgNecessidadesEspeciais)
                  }
                  checked={flgNecessidadesEspeciais}
                  variant="secondary"
                  id="flgNecessidadesEspeciais"
                  label="Tem necessidades especiais?"
                ></Form.Check>

                {flgNecessidadesEspeciais && (
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="fw-bold"
                      htmlFor="necessidadesEspeciais"
                    >
                      Necessidades Especiais
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Descreva as necessidades especiais do Pet"
                      id="necessidadesEspeciais"
                      onChange={(e) => setNecessidadesEspeciais(e.target.value)}
                      value={necessidadesEspeciais}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="tamanho">
                    Tamanho
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => setTamanho(e.target.value)}
                    value={tamanho}
                    id="tamanho"
                  >
                    <option value="0" className="fw-bold" disabled>
                      Selecione um tamanho
                    </option>
                    <option value="P">Pequeno (até 10kg)</option>
                    <option value="M">Médio (11 a 20kg)</option>
                    <option value="G">Grande (mais de 20kg)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" htmlFor="sexo">
                    Sexo
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => setSexo(e.target.value)}
                    value={sexo}
                    id="sexo"
                  >
                    <option value="0" className="fw-bold" disabled>
                      Selecione um sexo
                    </option>
                    <option value="M">Macho</option>
                    <option value="F">Fêmea</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={limparCampos}>
                Cancelar
              </Button>
              <Button variant="success" onClick={cadastrarEditarPet}>
                {modoEditar ? "Editar" : "Cadastrar"}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      {/* MODAL PARA EDITAR IMAGEM PET */}
      <Modal show={abrirModalEditarImagem} onHide={limparCampos}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-primary">
            Atualizar imagem
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold" htmlFor="imagem">
              Imagem
            </Form.Label>
            <Form.Control
              id="imagem"
              type="file"
              onChange={(e) => setImagem(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={limparCampos}>
            Cancelar
          </Button>
          <Button variant="success" onClick={editarImagem}>
            {isLoadingButton ? <CarregamentoBotao variant="dark" /> : "Editar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
