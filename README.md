# README

Eeks è una utility che mira a creare dei menu le cui opzioni sono fissate o generate tramite l'esecuzione di script. La scelta di una delle opzioni può generare a sua volta un sottomenu le cui opzioni possono essere in funzione delle scelte precedenti o può scaturire l'esecuzione di uno script i cui parametri possono essere funzione delle scelte precedenti.
La configurazione delle interazioni viene definita all'interno di un file json.

## How to install

run `npm install --global eeks`

run `eeks --help`

# Configurazione del file json

Il file json dovrà contenere un ogetto che descrive in che modo generare le opzioni e contiene un elenco di possibili modi di gestire l'opzione che verrà selezionata.

## Generazione delle opzioni

È possibile generare le opzioni in diversi modi:

### List

Per generare le opzioni a partire da un elenco fissato.  
Sarà necessario inserire nel json il parametro "type" con valore "list" e specificare l'elenco di opzioni nel parametro "options".

Es:
```
{
	"type": "list",
	"options": ["Hello", "World!"],
	"handlers": []
}
```


### Dynamic

Per generare le opzioni tramite l'esecuzione di uno script.  
Sarà necessario inserire nel json il parametro "type" con valore "dynamic" e specificare il comando da eseguire nel parametro "execute".

Es:
```
{
	"type": "dynamic",
	"execute": ["echo Hello; echo World!"],
	"handlers": []
}
```
### Recursive

Per generare le opzioni tramite l'esecuzione di uno script i cui argomenti sono in funzione delle precedenti scelte effettuate nello stesso menu.  
Sarà necessario inserire nel json il parametro "type" con valore "recursive" e specificare il comando da eseguire nel parametro "execute". Il comando inserito può contenere la variabile definita nel parametro "accumulator". Questa variabile conterrà inizialmente il valore definito in "initial" e nelle successive esecuzioni il valore definito da "initial" più tutte le opzioni scelte fino ad ora separate da spazi. 
Dopo aver effettuato una scelta verrà eseguito il comando definito nel parametro "stop-condition", se questo comando avrà come exit code 0 allora la ricorsione terminerà.

Es:
```
{
	"type": "recursive",
	"accumulator": { "name": "acc", "initial": "Hello" },
	"execute": ["echo {acc}; echo 'World!'"],
	"stop-condition": ["echo {acc} | grep 'World!'"],
	"handlers": []
}
```

## Settaggio delle variabili

Effettuando una scelta sarà possibile settare delle variabili che poi potranno essere utilizzate in tutti i comandi. Per settare una variabile sarà possibile inserire il parametro "set" contenente la lista di variabili da settare.

Es.
```
{
	"type": "list",
	"set": [ { "name": "greeting" } ],
	"options": ["Hello World!", "Welcome to eeks!"],
	"handlers": []
}
```

Nell'esempio di sopra la variabile `greeting` conterrà "Hello World!" o "Welcome to eeks!" in base alla scelta effettuata.  
È possibile applicare dei filtri prima di settare le variabili per estrarre delle singole informazioni dalla scelta effettuata. Per farlo andrà configurato il parametro "filters" contenente una lista di filtri da applicare.  
Il primo modo per applicare un filtro è attraverso una sostituzione tramite regex.

Es.
```
{
	"type": "list",
	"set": [ 
		{ 
			"name": "greeting",
			"filters": [
				{
					"type": "regex",
					"substitute": "([A-z]+) .*",
					"with": "$1"
				}
			]
		}
	],
	"options": ["Hello World!", "Welcome to eeks!"],
	"handlers": []
}
```

Nell'esempio precedente la variabile `greeting` conterrà il valore "Hello" o "Welcome" in base alla scelta effettuata.

Il secondo modo per applicare un filtro è tramite l'esecuzione di un comando.

Es.
```
{
	"type": "list",
	"set": [ 
		{ 
			"name": "count-spaces",
			"filters": [
				{
					"type": "command",
					"placeholder": "full-greeting",
					"execute": [ "echo {full-greeting} | tr -cd ' ' | wc -c" ]
				}
			]
		}
	],
	"options": ["Hello World!", "Welcome to eeks!"],
	"handlers": []
}
```

## Gestione delle scelte