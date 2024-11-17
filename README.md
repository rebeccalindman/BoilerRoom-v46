# Eget arbete v 46 

Planerade först i grupp och fortsatte efter den planen

Har lagt ganska många timmar på att fixa med CSS och HTML utöver JS

// Alldeles för mycket tid på ett experiment //
Försökte strukturera om koden i fler filer och la för mycket tid på detta. 

Gav till slut upp och accepterar att det bästa är att ha en struktur från början, eftersom att jag nog hade byggt vissa funktioner annorlunda med detta i åtanke. 

T.ex. fler små utilities och tydligare avgränsning mellan utilities/UI/data.

//Felsökning och UX//
Bad min sambo att klicka runt lite och det kom fram flera förbättringsområden som var relativt enkla att åtgärda.
- Placering av knappar 
- Emptry Nest skapade en bugg med save och new note funktionerna
- Otryliga sorteringsknappar
- Okonventionellt med timer på "bekräftande", bytt till att klicka utanför knappen
- Önskvärt med hover på knappar


//Krav//

Bör uppfylla grundläggande krav.

Eventuellt kan det finnas en åsikt om "ta bort"-knappen för den enskilda anteckningen.

//Tar med mig//
- Se över namngivning av const eller let
- CSS och HTML/JS borde inte ha samma typ av namngivning, förvirrande (typ save-button vs saveButton)
- Planera en mappstruktur för att hantera många funktioner, t.ex.
    * ui.js
    * utils.js
    * events.js
    * main.js
    * data.js

