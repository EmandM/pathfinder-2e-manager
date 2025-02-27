import { useRouter, useRoute } from 'vue-router';
const router = useRouter();

export function useRouteInfo() {
  const route = useRoute(); 
  console.log(route.name, route, route.params)

  
}

