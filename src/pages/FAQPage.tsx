import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    category: "Pedidos & Entregas",
    items: [
      {
        q: "Qual o prazo de entrega?",
        a: "O prazo de entrega varia de 3 a 10 dias úteis, dependendo da sua localização. Após a confirmação do pagamento, você receberá um código de rastreamento por email."
      },
      {
        q: "Frete é grátis?",
        a: "Sim! Para compras acima de R$ 299, o frete é grátis para todo o Brasil. Abaixo deste valor, o frete é calculado com base no seu CEP."
      },
      {
        q: "Como rastrear meu pedido?",
        a: "Após o envio, você receberá um email com o código de rastreamento. Também pode acompanhar na página 'Meus Pedidos' do site."
      },
      {
        q: "Posso alterar o endereço de entrega após a compra?",
        a: "Sim, desde que o pedido ainda não tenha sido enviado. Entre em contato conosco por WhatsApp ou email o mais rápido possível."
      },
    ],
  },
  {
    category: "Trocas & Devoluções",
    items: [
      {
        q: "Posso trocar minha peça?",
        a: "Sim! Aceitamos trocas em até 30 dias após o recebimento, desde que a peça esteja com etiqueta e sem uso. A primeira troca é por nossa conta."
      },
      {
        q: "Como solicitar uma devolução?",
        a: "Entre em contato pelo WhatsApp ou email informando o número do pedido. Enviaremos as instruções e o código de postagem. O reembolso é feito em até 10 dias úteis."
      },
      {
        q: "Peças íntimas podem ser trocadas?",
        a: "Por questões de higiene, peças íntimas (calcinhas, bodies) só podem ser trocadas se estiverem lacradas e sem sinais de uso."
      },
    ],
  },
  {
    category: "Medidas & Tamanhos",
    items: [
      {
        q: "Como escolher o tamanho certo?",
        a: "Cada página de produto possui um guia de medidas. Recomendamos medir-se com uma fita métrica. Em caso de dúvida, nossa equipe está disponível no WhatsApp para ajudar."
      },
      {
        q: "Os tamanhos são padronizados?",
        a: "Seguimos a tabela brasileira padrão (P: 34-36, M: 38-40, G: 42-44, GG: 46-48). Peças com ajuste podem variar — consulte a descrição."
      },
    ],
  },
  {
    category: "Cuidados com as Peças",
    items: [
      {
        q: "Como lavar peças de renda e seda?",
        a: "Recomendamos lavagem à mão com sabão neutro e água fria. Não torça — pressione delicadamente com uma toalha. Seque à sombra."
      },
      {
        q: "Como cuidar de peças de couro (harness)?",
        a: "Limpe com um pano levemente úmido. Evite exposição prolongada ao sol. Use hidratante de couro periodicamente para manter a flexibilidade."
      },
      {
        q: "Posso usar máquina de lavar?",
        a: "Não recomendamos. Peças delicadas devem ser lavadas à mão para preservar a qualidade dos materiais e acabamentos."
      },
    ],
  },
  {
    category: "Pagamento",
    items: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos PIX (com desconto) e cartão de crédito em até 3x sem juros."
      },
      {
        q: "É seguro comprar no site?",
        a: "Sim! Utilizamos criptografia SSL e não armazenamos dados de cartão. Seu pagamento é processado de forma segura."
      },
      {
        q: "Tem cupom de desconto?",
        a: "Sim! Use SUCCUBUS10 para 10% de desconto na primeira compra, ou PRIMEIRA para 15% off."
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container max-w-3xl">
        <motion.h1
          className="font-heading text-4xl md:text-5xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Perguntas Frequentes
        </motion.h1>
        <p className="text-muted-foreground font-body text-sm mb-10">
          Tire suas dúvidas sobre pedidos, entregas, trocas, tamanhos e cuidados com suas peças.
        </p>

        <div className="space-y-8">
          {faqs.map((section, si) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
            >
              <h2 className="font-heading text-xl md:text-2xl font-light mb-4">{section.category}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${si}-${i}`}
                    className="bg-card border border-border rounded-lg px-5"
                  >
                    <AccordionTrigger className="font-body text-sm hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card border border-border rounded-lg text-center">
          <p className="font-body text-sm text-muted-foreground mb-3">
            Não encontrou o que procurava?
          </p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-foreground/90 transition-colors"
          >
            Fale conosco no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
