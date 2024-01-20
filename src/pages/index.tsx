import { GetServerSideProps } from "next";

import { api } from "@/libs/axios";
import { Card } from "primereact/card";
import { Tooltip } from "primereact/tooltip";
import { MapPin, PaperPlaneTilt, WhatsappLogo, X } from "phosphor-react";

import { Menubar } from "primereact/menubar";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModalPrepareOrder } from "@/components/ModalPrepareOrder";

interface HomeProps {
  orders: OrderProps[];
}

export default function Home({ orders }: HomeProps) {
  const items = [
    {
      label: "Clientes",
      icon: "pi pi-fw pi-pencil",
      items: [
        {
          label: "Ver últimos pedidos",
          icon: "pi pi-fw pi-align-left",
        },
      ],
    },
    {
      label: "Usuários",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Visualizar usuário",
          icon: "pi pi-fw pi-user-plus",
        },
      ],
    },
    {
      label: "Sair da plataforma",
      icon: "pi pi-fw pi-power-off",
    },
  ];

  const [viewType, setViewType] = useState("3");
  const [hasTogglemodalPrepareOrder, setHasToggleModalPrepareOrder] =
    useState(false);

  const [orderSelect, setOrderSelect] = useState<OrderProps | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/sse");
    eventSource.onmessage = ({ data }) => {
      console.log(JSON.parse(data));
    };
  }, []);

  return (
    <main className="w-full min-h-screen p-10  bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <header>
        <Menubar model={items} />
      </header>

      <div className="flex items-center gap-6 my-5">
        <button
          type="button"
          className={`button-v-4 flex items-center gap-2 b p-2 rounded-md transition-all ${
            viewType === "3" ? "bg-zinc-800" : "bg-zinc-600"
          }`}
          onClick={() => setViewType("3")}
        >
          <div className="w-3 h-6 bg-zinc-500" />
          <div className="w-3 h-6 bg-zinc-500" />
          <div className="w-3 h-6 bg-zinc-500" />

          <Tooltip target=".button-v-3">Visualizar 3 em 3</Tooltip>
        </button>

        <button
          type="button"
          className={`button-v-4 flex items-center gap-2 b p-2 rounded-md transition-all ${
            viewType === "4" ? "bg-zinc-800" : "bg-zinc-600"
          }`}
          onClick={() => setViewType("4")}
        >
          <div className="w-3 h-6 bg-zinc-500" />
          <div className="w-3 h-6 bg-zinc-500" />
          <div className="w-3 h-6 bg-zinc-500" />
          <div className="w-3 h-6 bg-zinc-500" />

          <Tooltip target=".button-v-4">Visualizar 4 em 4</Tooltip>
        </button>
      </div>

      <div
        className={`grid ${
          viewType === "3" ? "grid-cols-3" : "grid-cols-4"
        } gap-6`}
      >
        {orders.map((order, index) => {
          return (
            <Card
              key={index}
              title={order.order_name}
              subTitle={`Pedido realizado por ${order.client_info.name}`}
            >
              <div className="mb-5 -mt-2 flex items-center gap-2">
                <Link
                  target="_blank"
                  href={`https://api.whatsapp.com/send?phone=${order.client_info.phone}`}
                  title="Clique para acessar o WhatsApp do cliente"
                  className="button-open-whatsapp w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white hover:brightness-90 transition-all"
                >
                  <WhatsappLogo size={20} />

                  <Tooltip target=".button-open-whatsapp">
                    Abrir o Whatsapp do cliente para enviar uma mensagem
                  </Tooltip>
                </Link>

                <button
                  type="button"
                  title="Clique para acessar o WhatsApp do cliente"
                  className="button-send-location w-9 h-9 bg-zinc-500 rounded-full flex items-center justify-center text-white hover:brightness-90 transition-all"
                >
                  <PaperPlaneTilt size={20} />

                  <Tooltip target=".button-send-location">
                    Enviar localização para o motoboy
                  </Tooltip>
                </button>
              </div>

              <p className="m-0">
                Tamanho: <strong>{order.order_info.size}</strong> <br />
                Sabor: <strong>{order.order_info.flavor}</strong> <br />
                Borda: <strong>{order.order_info.edge}</strong> <br />
              </p>

              <span className="block mt-4">
                Endereço de entrega: <br />
                <strong>
                  {order.client_info.address.street},{" "}
                  {order.client_info.address.number} -{" "}
                  {order.client_info.address.district} |{" "}
                  {order.client_info.address.city} -{" "}
                  {order.client_info.address.state}
                </strong>
              </span>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOrderSelect(order);
                    setHasToggleModalPrepareOrder(true);
                  }}
                  className="button-notification-client-order w-full bg-blue-500 text-white py-2 rounded-full hover:brightness-90 transition-all"
                >
                  Iniciar pedido
                  <Tooltip target=".button-notification-client-order">
                    Iniciar pedido e notificar cliente que iniciou
                  </Tooltip>
                </button>
                <button
                  type="button"
                  className="button-cancel-order w-10 h-10 flex items-center justify-center shrink-0 bg-red-500 text-white py-2 rounded-full hover:brightness-90 transition-all"
                >
                  <X size={20} />

                  <Tooltip target=".button-cancel-order">
                    Cancelar o pedido do cliente
                  </Tooltip>
                </button>
              </div>

              <span className="text-sm text-zinc-600 block mt-4">
                Pedido gerado: 26 de setembro às 22:20:34
              </span>
            </Card>
          );
        })}
      </div>

      <ModalPrepareOrder
        orderSelect={orderSelect}
        visible={hasTogglemodalPrepareOrder}
        onHide={() =>
          setHasToggleModalPrepareOrder(!hasTogglemodalPrepareOrder)
        }
      />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get("/order");

  return {
    props: {
      orders: data,
    },
  };
};
