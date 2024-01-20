import { api } from "@/libs/axios";
import { GetServerSideProps } from "next";

interface OrderClientProps {
  order: OrderProps;
}

export default function OrderClient({ order }: OrderClientProps) {
  return (
    <main className="w-full min-h-screen p-10  bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      {JSON.stringify(order.client_info)}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
}: any) => {
  const { orderId } = params;
  const { data } = await api.get(`/order/${orderId}`);

  return {
    props: {
      order: data,
    },
  };
};
