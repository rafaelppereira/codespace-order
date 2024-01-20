import { useEffect, useState } from "react";
import { Steps } from "primereact/steps";
import { Dialog } from "primereact/dialog";
import { TabView } from "primereact/tabview";
import { TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";

import { Editor } from "primereact/editor";
import { api } from "@/libs/axios";

interface ModalPrepareOrderProps {
  visible: boolean;
  onHide: () => void;
  orderSelect: OrderProps | null;
}

export function ModalPrepareOrder({
  visible,
  onHide,
  orderSelect,
}: ModalPrepareOrderProps) {
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState({} as OrderProps);

  const items = [
    {
      label: "Começou a preparar",
    },
    {
      label: "Preparando",
    },
    {
      label: "Saiu para entrega",
    },
    {
      label: "Entregue",
    },
  ];

  const orderStatus: any = {
    "Começou a preparar": 0,
    Preparando: 1,
    "Saiu para entrega": 2,
    Entregue: 3,
  };

  useEffect(() => {
    if (orderSelect) {
      setStatus(orderSelect?.status);
    }
  }, [orderSelect]);

  async function changeUpdateStatusOrder(value: string) {
    setStatus(value);

    if (value !== "Ocorreu um problema") {
      try {
        await api.patch(`/order/${orderSelect?.id}`, {
          status: value,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    setOrder(orderSelect);
  }, [orderSelect]);

  return (
    <Dialog
      maximizable
      onHide={onHide}
      visible={visible}
      draggable={false}
      className="w-[50vw]"
      header="Pedido #0001"
    >
      <Steps
        model={items}
        activeIndex={orderStatus[orderSelect ? orderSelect?.status : 0]}
      />
      <TabView className="mt-10">
        <TabPanel header="Informações do pedido">
          <p className="m-0 text-lg">
            Tamanho: <strong>{orderSelect?.order_info.size}</strong> <br />
            Sabor: <strong>{orderSelect?.order_info.flavor}</strong> <br />
            Borda: <strong>{orderSelect?.order_info.edge}</strong> <br />
          </p>

          <span className="block mt-4 text-lg">Total R$89,00</span>
        </TabPanel>
        <TabPanel header="Endereço de entrega">
          <p className="m-0 text-lg">
            Rua: <strong>{orderSelect?.client_info.address.street}</strong>{" "}
            <br />
            Número: <strong>
              {orderSelect?.client_info.address.number}
            </strong>{" "}
            <br />
            Bairro: <strong>
              {orderSelect?.client_info.address.district}
            </strong>{" "}
            <br />
            Cidade: <strong>
              {orderSelect?.client_info.address.city}
            </strong>{" "}
            <br />
            Estado: <strong>{orderSelect?.client_info.address.state}</strong>
          </p>
        </TabPanel>
        <TabPanel header="Informações do cliente">
          {" "}
          <p className="m-0 text-lg">
            Nome completo: <strong>{orderSelect?.client_info.name}</strong>{" "}
            <br />
            Endereço de e-mail:{" "}
            <strong>{orderSelect?.client_info.email}</strong> <br />
            Telefone: <strong>{orderSelect?.client_info.phone}</strong> <br />
          </p>
        </TabPanel>
      </TabView>
      <div className="mt-5 flex items-center gap-5">
        <Dropdown
          value={status}
          onChange={(e) => changeUpdateStatusOrder(e.target.value)}
          options={[
            {
              label: "Preparando",
              value: "Preparando",
            },
            {
              label: "Saiu para entrega",
              value: "Saiu para entrega",
            },
            {
              label: "Ocorreu um problema",
              value: "Ocorreu um problema",
            },
          ]}
          placeholder="Selecione um status do pedido"
          className="w-full md:w-14rem"
        />
      </div>

      {status === "Ocorreu um problema" && (
        <div className="mt-5">
          <Editor
            placeholder="Digite a mensagem do problema para que o cliente fique ciente disso"
            style={{ height: "200px" }}
          />

          <button
            type="button"
            className="mt-3 bg-blue-500 text-white px-4 py-1 rounded-md"
          >
            Enviar mensagem ao cliente
          </button>
        </div>
      )}
    </Dialog>
  );
}
