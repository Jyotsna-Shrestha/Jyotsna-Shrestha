PORT ?= 8000

.PHONY: serve stop clean

serve:
	@echo "Serving portfolio at http://localhost:$(PORT)"
	python3 -m http.server $(PORT) --directory .

stop:
	-pkill -f "python3 -m http.server $(PORT)" 2>/dev/null; echo "stopped"

clean:
	rm -f icons/*.png
	rm -f .DS_Store
