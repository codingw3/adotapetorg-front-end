import { useContext, useEffect, useState } from "react";
import { Carousel, Image, Pagination, Row } from "react-bootstrap";
import { CarregamentoLista } from "../../components/Carregamento";
import {
  MENSAGEM_NENHUMA_POSTAGEM_CADASTRADA,
  MENSAGEM_NENHUM_PET_CADASTRADO,
  PRIMEIRA_PAGINA,
  REGISTROS_PAGINACAO,
} from "../../components/Constantes";
import { MessageContext } from "../../contexts/MessageContext";
import banner01 from "../../images/banner_pet_01.jpg";
import banner02 from "../../images/banner_pet_02.jpg";
import banner03 from "../../images/banner_pet_03.jpg";
import Api from "../../services/Api";
import { verificaLista } from "../../utils/Util";
import TituloPagina from "./../../components/TituloPagina";
import CardPet from "./../../components/cardPet/CardPet";
import CardPostagem from "../../components/cardPostagem/CardPostagem";
import { AnuncioInArticle } from "../../components/adsense/Anuncio";

function Inicio() {
  const [listaPets, setListaPets] = useState([]);
  const [listaPostagens, setListaPostagens] = useState([]);
  const [isLoadingListaPet, setIsLoadingListaPet] = useState(false);
  const [isLoadingBlogPostagens, setIsLoadingBlogPostagens] = useState(false);
  const { setarMensagem } = useContext(MessageContext);
  const [dataPet, setDataPet] = useState([]);
  const [dataPostagem, setDataPostagem] = useState([]);

  useEffect(() => {
    listarTodosPets(PRIMEIRA_PAGINA);
    listarTodasPostagens(PRIMEIRA_PAGINA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function listarTodosPets(numeroPaginaPet) {
    setIsLoadingListaPet(true);

    Api.get(`pets?page=${numeroPaginaPet}`)
      .then(({ data }) => {
        setDataPet(data);
        setListaPets(data.data);
      })
      .catch(({ response }) => {
        setarMensagem(response.data.message, null);
      })
      .finally(() => {
        setIsLoadingListaPet(false);
      });
  }

  function listarTodasPostagens(numeroPaginaPostagem) {
    setIsLoadingBlogPostagens(true);

    Api.get(`blog/todas/postagens?page=${numeroPaginaPostagem}`)
      .then(({ data }) => {
        setDataPostagem(data);
        setListaPostagens(data.data);
      })
      .catch(({ response }) => {
        setarMensagem(response.data.message, null);
      })
      .finally(() => {
        setIsLoadingBlogPostagens(false);
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="container vw-100">
        {/* PASSANDO NULL PARA VIR SOMENTE O NOME ADOTA PET ORG */}
        <TituloPagina titulo={null} />

        <Carousel
          pause="hover"
          className="bg-dark rounded text-center image-container-slider mb-3"
        >
          <Carousel.Item interval={5000}>
            <Image className="w-100" src={banner01} />
            {/* <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption> */}
          </Carousel.Item>

          <Carousel.Item interval={5000}>
            <Image className="w-100" src={banner02} />
            {/* <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption> */}
          </Carousel.Item>

          <Carousel.Item interval={5000}>
            <Image className="w-100" src={banner03} />
            {/* <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption> */}
          </Carousel.Item>
        </Carousel>

        <h2 className="mb-3 fw-bold text-center bg-warning p-3 rounded">
          Lista: Pets
        </h2>

        {isLoadingListaPet ? (
          <CarregamentoLista />
        ) : (
          <>
            {verificaLista(listaPets) ? (
              <div className="mb-3">{MENSAGEM_NENHUM_PET_CADASTRADO}</div>
            ) : (
              <>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-3">
                  <>
                    {listaPets.map((pet) => (
                      <CardPet key={pet.id} pet={pet} />
                    ))}
                  </>
                </Row>
              </>
            )}

            {!verificaLista(listaPets) &&
              dataPet.total >= REGISTROS_PAGINACAO && (
                <Row className="my-3">
                  <Pagination className="d-flex justify-content-center align-items-center">
                    {/* BOTÃO DE VOLTAR PARA A PRIMEIRA PÁGINA */}
                    <Pagination.First
                      disabled={dataPet.current_page === PRIMEIRA_PAGINA}
                      onClick={() => listarTodosPets(dataPet.first_page)}
                    />

                    {/* BOTÃO DE VOLTAR PARA A PÁGINA */}
                    <Pagination.Prev
                      disabled={dataPet.current_page === PRIMEIRA_PAGINA}
                      onClick={() => listarTodosPets(dataPet.current_page - 1)}
                    />

                    {/* PARA MOSTRAR QUE EXISTE MAIS PÁGINA ANTERIORES */}
                    {dataPet.current_page > 2 && (
                      <Pagination.Ellipsis disabled />
                    )}

                    {/* PÁGINA ATUAL MENOS UM */}
                    {dataPet.current_page >= 2 && (
                      <Pagination.Item
                        onClick={() =>
                          listarTodosPets(dataPet.current_page - 1)
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
                          listarTodosPets(dataPet.current_page + 1)
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
                      onClick={() => listarTodosPets(dataPet.current_page + 1)}
                    />

                    {/* BOTÃO DE IR PARA A ÚLTIMA PÁGINA */}
                    <Pagination.Last
                      disabled={dataPet.current_page === dataPet.last_page}
                      onClick={() => listarTodosPets(dataPet.last_page)}
                    />
                  </Pagination>
                </Row>
              )}
          </>
        )}

        <AnuncioInArticle />

        <h2 className="mb-3 fw-bold text-center bg-warning p-3 rounded">
          Blog: Postagens
        </h2>

        {isLoadingBlogPostagens ? (
          <CarregamentoLista />
        ) : (
          <>
            {verificaLista(listaPostagens) ? (
              <div className="mb-3">{MENSAGEM_NENHUMA_POSTAGEM_CADASTRADA}</div>
            ) : (
              <>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  <>
                    {listaPostagens.map((postagem) => (
                      <CardPostagem key={postagem.id} postagem={postagem} />
                    ))}
                  </>
                </Row>
              </>
            )}
          </>
        )}

        {!verificaLista(listaPostagens) &&
          dataPostagem.total >= REGISTROS_PAGINACAO && (
            <Row className="my-3">
              <Pagination className="d-flex justify-content-center align-items-center">
                {/* BOTÃO DE VOLTAR PARA A PRIMEIRA PÁGINA */}
                <Pagination.First
                  disabled={dataPostagem.current_page === PRIMEIRA_PAGINA}
                  onClick={() => listarTodasPostagens(dataPostagem.first_page)}
                />

                {/* BOTÃO DE VOLTAR PARA A PÁGINA */}
                <Pagination.Prev
                  disabled={dataPostagem.current_page === PRIMEIRA_PAGINA}
                  onClick={() =>
                    listarTodasPostagens(dataPostagem.current_page - 1)
                  }
                />

                {/* PARA MOSTRAR QUE EXISTE MAIS PÁGINA ANTERIORES */}
                {dataPostagem.current_page > 2 && (
                  <Pagination.Ellipsis disabled />
                )}

                {/* PÁGINA ATUAL MENOS UM */}
                {dataPostagem.current_page >= 2 && (
                  <Pagination.Item
                    onClick={() =>
                      listarTodasPostagens(dataPostagem.current_page - 1)
                    }
                  >
                    {dataPostagem.current_page - 1}
                  </Pagination.Item>
                )}

                {/* PÁGINA ATUAL */}
                <Pagination.Item active>
                  {dataPostagem.current_page}
                </Pagination.Item>

                {/* PÁGINA ATUAL MAIS UM */}
                {dataPostagem.current_page + 1 <= dataPostagem.last_page && (
                  <Pagination.Item
                    onClick={() =>
                      listarTodasPostagens(dataPostagem.current_page + 1)
                    }
                  >
                    {dataPostagem.current_page + 1}
                  </Pagination.Item>
                )}

                {/* PARA MOSTRAR QUE EXISTE MAIS PRÓXIMAS PÁGINAS */}
                {dataPostagem.current_page + 1 < dataPostagem.last_page && (
                  <Pagination.Ellipsis disabled />
                )}

                {/* BOTÃO DE IR PARA A PRÓXIMA PÁGINA */}
                <Pagination.Next
                  disabled={
                    dataPostagem.current_page === dataPostagem.last_page
                  }
                  onClick={() =>
                    listarTodasPostagens(dataPostagem.current_page + 1)
                  }
                />

                {/* BOTÃO DE IR PARA A ÚLTIMA PÁGINA */}
                <Pagination.Last
                  disabled={
                    dataPostagem.current_page === dataPostagem.last_page
                  }
                  onClick={() => listarTodasPostagens(dataPostagem.last_page)}
                />
              </Pagination>
            </Row>
          )}

        {/* <h2 className="mb-3 text-center">Apoiadores</h2> */}
      </div>
    </div>
  );
}

export default Inicio;
