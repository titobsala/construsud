erDiagram
    ORGANIZATION {
        uuid id PK
        string name
        string vat "Número fiscal da empresa"
        timestamp created_at
        timestamp updated_at
    }
    
    USER {
        uuid id PK
        string email
        string first_name
        string last_name
        string position "Cargo do usuário"
        uuid organization_id FK
        boolean is_admin
        timestamp created_at
        timestamp updated_at
    }
    
    PROJECT {
        uuid id PK
        string name
        string client_name
        string status
        uuid organization_id FK
        uuid created_by FK
        decimal default_margin "Margem padrão (%)"
        decimal cost_per_km "Custo por km (€)"
        decimal driver_cost "Custo motorista (€/km)"
        decimal transport_cost "Custo transporte (€/km)"
        decimal official_hourly_cost "Custo/H Oficial (€)"
        decimal helper_hourly_cost "Custo/H Ajudante (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    CHAPTER {
        uuid id PK
        string number "Ex: CAR 1"
        string title "Ex: FUNDAÇÃO SUPERFICIAL"
        uuid project_id FK
        int order
        decimal total_cost "Custo total do capítulo"
        timestamp created_at
        timestamp updated_at
    }
    
    ITEM {
        uuid id PK
        string name "Ex: AREIA"
        uuid chapter_id FK
        string unit "Ex: M³, KG, UN"
        decimal quantity
        decimal unit_price "€/UN"
        decimal total_price "Total €"
        boolean is_material "Indica se é um material"
        uuid parent_item_id FK "NULL para itens de primeiro nível"
        int order
        timestamp created_at
        timestamp updated_at
    }
    
    ITEM_FINANCIAL {
        uuid id PK
        uuid item_id FK
        decimal dry_cost "Custo seco (€)"
        decimal total_cost "Custo total (€)"
        decimal margin_percentage "Margem (%)"
        decimal sale_price "Venda (€)"
        decimal margin_amount "Margem (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    SUBCONTRACTOR {
        uuid id PK
        uuid item_id FK
        uuid subcontractor_list_id FK "Referência ao subcontratado da lista"
        string name "Nome do subcontratado"
        decimal price "Preço (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    SUBCONTRACTOR_LIST {
        uuid id PK
        uuid organization_id FK
        string name "Nome do subcontratado"
        string details "Detalhes adicionais"
        timestamp created_at
        timestamp updated_at
    }
    
    LOGISTICS {
        uuid id PK
        uuid item_id FK
        decimal kilometers "Distância (km)"
        decimal total_cost "Custo total (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    MISCELLANEOUS {
        uuid id PK
        uuid item_id FK
        decimal food_cost "Alimentação (€)"
        decimal travel_cost "Passagens (€)"
        decimal other_cost "Outros (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    LABOR {
        uuid id PK
        uuid item_id FK
        string type "E/O/A (Equipamento/Outro/Ajudante)"
        decimal duration "Duração (h)"
        decimal total_cost "Custo total (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    AMORTIZATION {
        uuid id PK
        uuid project_id FK
        decimal percentage "Percentual de distribuição"
        decimal total_cost "Custo total das amortizações (€)"
        string description "Descrição"
        timestamp created_at
        timestamp updated_at
    }
    
    PROJECT_FINANCIAL {
        uuid id PK
        uuid project_id FK
        decimal dry_cost "Custo seco (€)"
        decimal total_cost "Custo total (€)"
        decimal margin_percentage "Margem (%)"
        decimal sale_price "Venda (€)"
        decimal margin_amount "Margem (€)"
        decimal material_cost "Custo de material (€)"
        timestamp created_at
        timestamp updated_at
    }
    
    ORGANIZATION ||--o{ USER : "possui"
    ORGANIZATION ||--o{ PROJECT : "possui"
    ORGANIZATION ||--o{ SUBCONTRACTOR_LIST : "possui"
    USER }o--o{ PROJECT : "cria/acessa"
    PROJECT ||--o{ CHAPTER : "contém"
    PROJECT ||--o{ AMORTIZATION : "possui"
    PROJECT ||--|| PROJECT_FINANCIAL : "possui"
    CHAPTER ||--o{ ITEM : "contém"
    ITEM ||--o{ ITEM : "pode ter sub-itens"
    ITEM ||--|| ITEM_FINANCIAL : "possui"
    ITEM ||--o{ SUBCONTRACTOR : "possui"
    ITEM ||--o{ LOGISTICS : "possui"
    ITEM ||--o{ MISCELLANEOUS : "possui"
    ITEM ||--o{ LABOR : "possui"
    SUBCONTRACTOR_LIST ||--o{ SUBCONTRACTOR : "referenciado por"