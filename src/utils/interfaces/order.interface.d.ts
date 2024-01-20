interface OrderClientInfoAddressProps {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
}

interface OrderClientInfoProps {
  name: string;
  email: string;
  phone: string;
  address: OrderClientInfoAddressProps;
}

interface OrderInfoProps {
  size: string;
  flavor: string;
  edge: string;
}

interface OrderProps {
  client_info: OrderClientInfoProps;
  order_info: OrderInfoProps;
  order_name: string;
  status: string;
  id: string;
}
