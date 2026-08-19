const EMAIL = "szydelkomania.amigurumi@gmail.com";

function manufacturer() {
  return `
    <h3>Informacje o producencie</h3>
    <p>Szydełkomania_amigurumi<br>Ada Śliwińska<br><a href="mailto:${EMAIL}">${EMAIL}</a></p>`;
}

const SAFETY_BY_SLUG = {
  torebki: `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Torebki szydełkowe Szydełkomania_amigurumi są przeznaczone do użytkowania przez osoby dorosłe, zgodnie z ich przeznaczeniem jako torebki i akcesoria użytkowe.</p>
    <ul>
      <li>Przed każdym użyciem należy sprawdzić stan torebki, w szczególności szwów, mocowań, karabińczyków, pasków, łańcuszków oraz innych elementów metalowych.</li>
      <li>W przypadku zauważenia poluzowania, pęknięcia, rozprucia lub innego uszkodzenia elementów konstrukcyjnych należy zaprzestać użytkowania do czasu usunięcia problemu.</li>
      <li>Torebki należy użytkować zgodnie z ich przeznaczeniem i nie przeciążać ich nadmiernym ciężarem.</li>
      <li>Nie należy używać uszkodzonej torebki ani jej elementów mocujących.</li>
      <li>Elementy metalowe mogą nagrzewać się pod wpływem wysokiej temperatury oraz mogą ulec uszkodzeniu w wyniku niewłaściwego użytkowania lub kontaktu z substancjami chemicznymi.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p><strong>Torebki bez elementów ze skóry naturalnej:</strong> można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania i wykręcania. Po praniu należy nadać torebce odpowiedni kształt i pozostawić ją do wyschnięcia w sposób zgodny z właściwościami użytych materiałów.</p>
    <p><strong>Torebki zawierające elementy ze skóry naturalnej:</strong> nie należy prać ani moczyć torebki. Kontakt skóry z wodą może prowadzić do jej odkształcenia, odbarwienia lub pogorszenia jej właściwości. Torebkę należy czyścić za pomocą wilgotnej ściereczki.</p>
    <h3>Ważne</h3>
    <p>Torebka jest produktem wykonywanym ręcznie. Drobne różnice w wyglądzie, ułożeniu splotu czy strukturze materiału są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu i skontaktować się z Pracownią.</p>`,

  plecaki: `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Plecaki szydełkowe Szydełkomania_amigurumi są przeznaczone do użytkowania przez osoby dorosłe, zgodnie z ich przeznaczeniem jako plecaki i akcesoria użytkowe.</p>
    <ul>
      <li>Przed każdym użyciem należy sprawdzić stan plecaka, w szczególności szwów, mocowań, karabińczyków, szelek, zamków oraz innych elementów metalowych.</li>
      <li>W przypadku zauważenia poluzowania, pęknięcia, rozprucia lub innego uszkodzenia elementów konstrukcyjnych należy zaprzestać użytkowania do czasu usunięcia problemu.</li>
      <li>Plecak należy użytkować zgodnie z jego przeznaczeniem i nie przeciążać go nadmiernym ciężarem.</li>
      <li>Nie należy używać uszkodzonego plecaka ani jego elementów mocujących.</li>
      <li>Jeżeli plecak posiada dekoracyjny chwost lub breloczek mocowany za pomocą karabińczyka, przed użyciem należy sprawdzić jego prawidłowe zamocowanie.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p>Plecaki można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania i wykręcania. Po praniu należy nadać plecakowi odpowiedni kształt i pozostawić go do wyschnięcia w sposób zgodny z właściwościami użytych materiałów.</p>
    <h3>Ważne</h3>
    <p>Plecak jest produktem wykonywanym ręcznie. Drobne różnice w wyglądzie, ułożeniu splotu czy strukturze materiału są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu i skontaktować się z Pracownią.</p>`,

  maskotki: `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Maskotki dekoracyjne Szydełkomania_amigurumi są przeznaczone wyłącznie jako element dekoracyjny wnętrza, w szczególności do dekoracji pokoju. Nie są przeznaczone do intensywnej zabawy.</p>
    <ul>
      <li>Produkt należy użytkować zgodnie z jego przeznaczeniem jako dekorację.</li>
      <li>Przed użyciem należy sprawdzić stan maskotki, w szczególności szwów, oczek oraz pozostałych elementów dekoracyjnych.</li>
      <li>W przypadku zauważenia poluzowania, uszkodzenia lub odczepienia któregokolwiek z elementów należy zaprzestać użytkowania produktu.</li>
      <li>Nie należy ciągnąć za oczka, elementy dekoracyjne, ubranka ani inne części maskotki.</li>
      <li>W przypadku modeli posiadających zdejmowane ubranka lub inne dodatkowe elementy należy sprawdzić ich prawidłowe zamocowanie.</li>
      <li>Maskotki należy przechowywać w sposób zapobiegający ich uszkodzeniu.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p>Maskotki można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania, szorowania i wykręcania.</p>
    <p>Po praniu należy delikatnie odcisnąć nadmiar wody, nadać maskotce odpowiedni kształt i pozostawić ją do całkowitego wyschnięcia. Nie zaleca się suszenia w wysokiej temperaturze ani przy bezpośrednim źródle ciepła.</p>
    <h3>Ważne</h3>
    <p>Maskotka jest produktem wykonywanym ręcznie. Drobne różnice w wyglądzie, kształcie, ułożeniu splotu czy strukturze włóczki są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu i skontaktować się z Pracownią.</p>`,

  "zestawy-dla-dzieci": `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Zestawy prezentowe Szydełkomania_amigurumi są przeznaczone dla dzieci w wieku 0–3 miesiące i zawierają elementy przeznaczone do użytkowania przez niemowlę, w tym ubranko, buciki, maskotkę oraz maskotkę na drewnianym kółeczku.</p>
    <ul>
      <li>Przed każdym użyciem należy sprawdzić stan wszystkich elementów zestawu, w szczególności szwów, mocowań, guzików, oczek, drewnianego kółeczka oraz pozostałych elementów.</li>
      <li>W przypadku zauważenia poluzowania, pęknięcia, rozprucia, odczepienia lub innego uszkodzenia któregokolwiek z elementów należy natychmiast zaprzestać jego użytkowania.</li>
      <li>Należy zwrócić szczególną uwagę na trwałość przyszytych guzików oraz wszystkich elementów maskotki. Nie należy pozwalać dziecku na użytkowanie produktu, jeśli którykolwiek element jest poluzowany lub uszkodzony.</li>
      <li>Maskotka na drewnianym kółeczku jest przeznaczona do chwytania i użytkowania przez niemowlę. Należy każdorazowo sprawdzić prawidłowe zamocowanie wszystkich jej elementów.</li>
      <li>Nie należy pozostawiać dziecka z uszkodzonym produktem ani dopuszczać do użytkowania elementów zestawu w przypadku ich uszkodzenia.</li>
      <li>Zestaw należy użytkować zgodnie z jego przeznaczeniem oraz informacjami dotyczącymi bezpieczeństwa dołączonymi do produktu.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p>Elementy tekstylne oraz maskotki można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania, szorowania i wykręcania.</p>
    <p>Po praniu należy delikatnie odcisnąć nadmiar wody, nadać produktom odpowiedni kształt i pozostawić je do całkowitego wyschnięcia.</p>
    <p>Elementów zawierających drewniane kółeczko nie należy moczyć ani prać w całości. Drewniane elementy należy chronić przed długotrwałym kontaktem z wodą.</p>
    <h3>Ważne</h3>
    <p>Produkty wykonywane są ręcznie. Drobne różnice w wyglądzie, ułożeniu splotu, kształcie czy strukturze włóczki są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>W przypadku wystąpienia jakiegokolwiek uszkodzenia mogącego wpływać na bezpieczeństwo dziecka należy natychmiast zaprzestać korzystania z produktu.</p>
    <p>Szczególną uwagę należy zwracać na stan szwów, guzików, oczek, elementów drewnianych oraz pozostałych elementów mogących ulec poluzowaniu podczas użytkowania.</p>`,

  "personalizowane-zwierzaki": `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Maskotki personalizowane Szydełkomania_amigurumi są wykonywane na podstawie zdjęcia wskazanego przez klienta i stanowią dekoracyjną podobiznę zwierzęcia. Produkt przeznaczony jest jako ozdoba lub, w przypadku modeli wyposażonych w mocowanie, jako breloczek. Nie jest przeznaczony do zabawy.</p>
    <ul>
      <li>Produkt należy użytkować zgodnie z jego przeznaczeniem jako dekorację lub breloczek.</li>
      <li>Przed każdym użyciem należy sprawdzić stan maskotki, w szczególności szwów, mocowań oraz elementów służących do jej zawieszenia.</li>
      <li>W przypadku zauważenia poluzowania, pęknięcia, rozprucia lub innego uszkodzenia należy zaprzestać użytkowania produktu.</li>
      <li>W przypadku modeli pełniących funkcję breloczka należy przed użyciem sprawdzić prawidłowe zamocowanie kółeczka, karabińczyka lub innych elementów mocujących.</li>
      <li>Nie należy ciągnąć za wystające elementy maskotki ani używać jej w sposób powodujący nadmierne obciążenie szwów lub mocowań.</li>
      <li>Produkt nie jest przeznaczony do intensywnej zabawy ani jako przedmiot przeznaczony dla małych dzieci.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p>Maskotki można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania, szorowania i wykręcania.</p>
    <p>Po praniu należy delikatnie odcisnąć nadmiar wody, nadać maskotce odpowiedni kształt i pozostawić ją do całkowitego wyschnięcia. W przypadku modeli posiadających metalowe elementy mocujące należy unikać długotrwałego moczenia.</p>
    <h3>Ważne</h3>
    <p>Maskotka jest produktem wykonywanym ręcznie na podstawie zdjęcia zwierzęcia przesłanego przez klienta. Drobne różnice w wyglądzie, proporcjach, kolorystyce, ułożeniu splotu czy strukturze włóczki są naturalną cechą rękodzieła i wynikają również z charakteru artystycznego odwzorowania.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu i skontaktować się z Pracownią.</p>`,

  "zabawki-dla-zwierzat": `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Zabawki dla zwierząt Szydełkomania_amigurumi są przeznaczone do zabawy przez psy lub koty, zgodnie z przeznaczeniem konkretnego produktu.</p>
    <ul>
      <li>Przed każdym użyciem należy sprawdzić stan zabawki, w szczególności szwów, splotów oraz wszystkich elementów konstrukcyjnych.</li>
      <li>Zabawki należy regularnie kontrolować pod kątem rozprucia, rozerwania, poluzowania lub innych uszkodzeń powstałych podczas zabawy.</li>
      <li>W przypadku zauważenia uszkodzenia należy natychmiast odebrać zwierzęciu zabawkę i zaprzestać jej użytkowania.</li>
      <li>Zabawka nie jest przeznaczona do nieograniczonego użytkowania ani nie jest niezniszczalna. Jej trwałość zależy między innymi od wielkości, siły i sposobu zabawy zwierzęcia.</li>
      <li>Podczas pierwszego użytkowania zaleca się obserwowanie zwierzęcia i ocenę, czy sposób korzystania z zabawki nie powoduje jej nadmiernego uszkadzania.</li>
      <li>Zabawki nie należy pozostawiać zwierzęciu, jeżeli została uszkodzona w sposób mogący spowodować oderwanie lub połknięcie fragmentów.</li>
      <li>W przypadku wędek dla kotów należy korzystać z nich pod nadzorem opiekuna. Drewniany kijek służy do trzymania zabawki przez opiekuna i nie jest przeznaczony do gryzienia przez zwierzę.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p>Zabawki można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania, szorowania i wykręcania.</p>
    <p>Po praniu należy delikatnie odcisnąć nadmiar wody i pozostawić zabawkę do całkowitego wyschnięcia przed ponownym udostępnieniem jej zwierzęciu.</p>
    <p>W przypadku wędek dla kotów nie należy moczyć drewnianego kijka. Część szydełkową należy czyścić zgodnie z powyższymi zaleceniami.</p>
    <h3>Ważne</h3>
    <p>Zabawki wykonywane są ręcznie. Drobne różnice w wyglądzie, ułożeniu splotu, kształcie czy strukturze włóczki są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>Zabawki dla zwierząt nie są produktami niezniszczalnymi. Ich zużycie lub uszkodzenie może nastąpić w zależności od indywidualnego sposobu zabawy zwierzęcia.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo zwierzęcia należy natychmiast zaprzestać korzystania z produktu.</p>`,

  dekoracje: `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Szydełkowe dekoracje Szydełkomania_amigurumi są przeznaczone do dekorowania wnętrz i należy użytkować je zgodnie z ich przeznaczeniem.</p>
    <ul>
      <li>Przed umieszczeniem dekoracji w wybranym miejscu należy sprawdzić jej stan, w szczególności sploty, szwy, mocowania oraz elementy służące do jej zawieszenia.</li>
      <li>W przypadku dekoracji zawieszanych należy upewnić się, że sposób i miejsce jej zamocowania są odpowiednie do jej ciężaru.</li>
      <li>Nie należy umieszczać dekoracji w miejscach, w których może spaść na osobę, zwierzę lub przedmioty, których upadek mógłby spowodować uszkodzenie.</li>
      <li>Dekoracji nie należy umieszczać w bezpośrednim kontakcie z otwartym ogniem ani w pobliżu źródeł wysokiej temperatury.</li>
      <li>W przypadku zauważenia uszkodzenia, rozprucia lub poluzowania elementów dekoracji należy zaprzestać jej użytkowania do czasu usunięcia problemu.</li>
      <li>Dekoracje nie są przeznaczone do zabawy ani do intensywnego użytkowania.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p>Sposób pielęgnacji zależy od rodzaju konkretnej dekoracji i zastosowanych materiałów.</p>
    <p>W przypadku dekoracji wykonanych ze sznurka bawełnianego zaleca się delikatne czyszczenie, najlepiej poprzez delikatne odkurzanie lub przetarcie powierzchni suchą albo lekko wilgotną ściereczką.</p>
    <p>Jeżeli dana dekoracja może być prana, informacja o możliwości prania i zalecanej temperaturze znajduje się w opisie produktu lub zostaje przekazana klientowi przed zakupem.</p>
    <h3>Ważne</h3>
    <p>Dekoracja jest produktem wykonywanym ręcznie. Drobne różnice w wyglądzie, ułożeniu splotu, kształcie czy strukturze sznurka są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu i skontaktować się z Pracownią.</p>`,

  kubeczki: `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Kubeczki Szydełkomania_amigurumi składają się z ceramicznego kubeczka oraz zdejmowanego, szydełkowego sweterka wykonanego z włóczki akrylowej.</p>
    <ul>
      <li>Przed użyciem należy sprawdzić stan ceramicznego kubeczka, w szczególności pod kątem pęknięć, wyszczerbień lub innych uszkodzeń.</li>
      <li>Uszkodzonego kubeczka nie należy używać.</li>
      <li>Szydełkowy sweterek pełni funkcję dekoracyjną i ochronną. Przed rozpoczęciem użytkowania kubeczka należy upewnić się, że sweterek jest prawidłowo założony.</li>
      <li>Sweterek należy zdjąć przed myciem kubeczka oraz przed umieszczeniem go w zmywarce lub podgrzewaniem napoju.</li>
      <li>Nie należy używać sweterka w bezpośrednim kontakcie z płomieniem ani w pobliżu innych źródeł wysokiej temperatury.</li>
      <li>Gorące napoje mogą powodować nagrzewanie się powierzchni ceramicznego kubeczka. Należy zachować ostrożność podczas przenoszenia kubeczka z gorącą zawartością.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p><strong>Ceramiczny kubeczek:</strong> należy myć zgodnie z zaleceniami dotyczącymi zastosowanej ceramiki. Przed myciem należy zdjąć szydełkowy sweterek.</p>
    <p><strong>Szydełkowy sweterek:</strong> można prać ręcznie w temperaturze do 30°C. Zaleca się delikatne pranie bez intensywnego pocierania i wykręcania. Po praniu należy delikatnie odcisnąć nadmiar wody, nadać sweterkowi odpowiedni kształt i pozostawić go do całkowitego wyschnięcia.</p>
    <h3>Ważne</h3>
    <p>Sweterek jest produktem wykonywanym ręcznie. Drobne różnice w wyglądzie, ułożeniu splotu czy strukturze włóczki są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>Sweterek jest elementem dekoracyjnym i nie stanowi części naczynia przeznaczonej do bezpośredniego kontaktu z żywnością lub napojem.</p>
    <p>W przypadku wystąpienia uszkodzenia kubeczka lub sweterka mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu.</p>`,

  dywany: `
    ${manufacturer()}
    <h3>Bezpieczeństwo i użytkowanie</h3>
    <p>Dywany i taborety w kształcie zwierzątek Szydełkomania_amigurumi są przeznaczone jako elementy wyposażenia i dekoracji pokoju dziecięcego. Należy użytkować je zgodnie z ich przeznaczeniem.</p>
    <p><strong>Dywany:</strong></p>
    <ul>
      <li>Przed użyciem należy sprawdzić stan dywanu, w szczególności splotów, szwów i ewentualnych elementów wykończeniowych.</li>
      <li>Dywan należy umieścić na stabilnym, równym podłożu.</li>
      <li>W przypadku śliskiej powierzchni podłogi zaleca się zastosowanie odpowiedniego podkładu antypoślizgowego.</li>
      <li>Należy regularnie sprawdzać stan dywanu. W przypadku rozprucia, uszkodzenia lub poluzowania elementów należy zaprzestać jego użytkowania do czasu usunięcia problemu.</li>
      <li>Dywan nie jest przeznaczony do wspinania się, ciągnięcia ani intensywnej zabawy.</li>
    </ul>
    <p><strong>Taborety:</strong></p>
    <ul>
      <li>Przed każdym użyciem należy sprawdzić stabilność taboretu oraz stan jego siedziska, szwów i elementów konstrukcyjnych.</li>
      <li>Taboret należy ustawiać wyłącznie na stabilnym i równym podłożu.</li>
      <li>Należy korzystać z taboretu zgodnie z jego przeznaczeniem jako siedziska.</li>
      <li>Nie należy stawać na taborecie, kołysać się na nim ani używać go jako podestu lub drabinki.</li>
      <li>W przypadku zauważenia niestabilności, uszkodzenia, rozprucia lub poluzowania elementów konstrukcyjnych należy zaprzestać użytkowania produktu.</li>
      <li>Dziecko korzystające z taboretu powinno pozostawać pod odpowiednim nadzorem osoby dorosłej.</li>
    </ul>
    <h3>Pielęgnacja</h3>
    <p><strong>Dywany:</strong> sposób pielęgnacji zależy od zastosowanych materiałów. Zaleca się regularne delikatne odkurzanie oraz czyszczenie zgodnie z zaleceniami dotyczącymi konkretnego produktu. Jeżeli dywan może być prany ręcznie, zalecana temperatura to 30°C. Informacja o możliwości prania zostaje przekazana klientowi przed zakupem.</p>
    <p><strong>Taborety:</strong> szydełkową część taboretu należy czyścić delikatnie, zgodnie z właściwościami zastosowanych materiałów. Elementów drewnianych nie należy moczyć ani narażać na długotrwały kontakt z wodą.</p>
    <h3>Ważne</h3>
    <p>Dywany i taborety są produktami wykonywanymi ręcznie. Drobne różnice w wyglądzie, kształcie, ułożeniu splotu czy strukturze włóczki są naturalną cechą rękodzieła i nie stanowią wady produktu.</p>
    <p>W przypadku wystąpienia uszkodzenia mogącego wpływać na bezpieczeństwo użytkowania należy zaprzestać korzystania z produktu i skontaktować się z Pracownią.</p>`,
};

SAFETY_BY_SLUG.dodatki = SAFETY_BY_SLUG.dekoracje;

function safetyHtml(slug) {
  return (SAFETY_BY_SLUG[slug] || SAFETY_BY_SLUG.dekoracje).replace(/\n\s+/g, "\n").trim();
}

function safetyPlain(slug) {
  return safetyHtml(slug)
    .replace(/<h3>/g, "")
    .replace(/<\/h3>/g, ". ")
    .replace(/<li>/g, "• ")
    .replace(/<\/li>/g, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { safetyHtml, safetyPlain, EMAIL };
