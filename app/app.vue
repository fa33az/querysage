<template>
  <div class="app-container">
    <!-- Sidebar Settings & Config -->
    <aside class="sidebar">
      <div class="brand">
        <img src="/logo.png" alt="QuerySage Logo" class="brand-logo-img">
      </div>

      <!-- Quick Samples -->
      <div class="sidebar-section">
        <h3>Quick Samples</h3>
        <div class="sample-buttons">
          <button 
            type="button" 
            class="btn btn-secondary btn-sm" 
            @click="loadSample('sample1')"
          >
            {{ sampleBtnTexts.sample1 }}
          </button>
          <button 
            type="button" 
            class="btn btn-secondary btn-sm" 
            @click="loadSample('sample2')"
          >
            {{ sampleBtnTexts.sample2 }}
          </button>
          <button 
            type="button" 
            class="btn btn-secondary btn-sm" 
            @click="loadSample('sample3')"
          >
            {{ sampleBtnTexts.sample3 }}
          </button>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>Database Engine</h3>
        <div class="select-wrapper">
          <select id="db-engine" v-model="dbEngine" @change="updateDefaultPort">
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlserver">Microsoft SQL Server</option>
            <option value="sqlite">SQLite</option>
            <option value="oracle">Oracle</option>
          </select>
        </div>
      </div>

      <!-- Direct DB Connection Credentials -->
      <div class="sidebar-section">
        <details class="config-details">
          <summary class="config-summary">Direct DB Connection</summary>
          <div class="config-details-content">
            <label class="checkbox-label">
              <input type="checkbox" v-model="directConnectEnabled" @change="saveDBCredentials">
              Enable Auto-Explain
            </label>
            
            <div v-show="directConnectEnabled" class="provider-fields">
              <label for="db-host">Host</label>
              <input type="text" id="db-host" v-model="dbHost" placeholder="localhost" @input="saveDBCredentials">
              
              <label for="db-port">Port</label>
              <input type="text" id="db-port" v-model="dbPort" placeholder="5432 / 3306" @input="saveDBCredentials">
              
              <label for="db-user">Username</label>
              <input type="text" id="db-user" v-model="dbUser" placeholder="postgres" @input="saveDBCredentials">
              
              <label for="db-pass">Password</label>
              <input type="password" id="db-pass" v-model="dbPass" placeholder="******" autocomplete="current-password" @input="saveDBCredentials">
              
              <label for="db-name">Database Name</label>
              <input type="text" id="db-name" v-model="dbName" placeholder="my_db" @input="saveDBCredentials">
              
              <label for="db-uri">Or Connection URI</label>
              <input type="text" id="db-uri" v-model="dbConnectionURI" placeholder="postgresql://user:pass@host:port/db" @input="saveDBCredentials">
            </div>
          </div>
        </details>
      </div>

      <!-- Collapsible Settings to reduce clutter -->
      <div class="sidebar-section">
        <details class="config-details">
          <summary class="config-summary">AI API Configurations</summary>
          <div class="config-details-content">
            <div class="config-tabs">
              <button 
                type="button" 
                class="config-tab-btn" 
                :class="{ active: activeProvider === 'gemini' }"
                @click="activeProvider = 'gemini'"
              >
                Gemini
              </button>
              <button 
                type="button" 
                class="config-tab-btn" 
                :class="{ active: activeProvider === 'openai' }"
                @click="activeProvider = 'openai'"
              >
                OpenAI
              </button>
            </div>
            
            <div v-show="activeProvider === 'gemini'" class="provider-fields">
              <label for="gemini-key">Gemini API Key</label>
              <input 
                type="password" 
                id="gemini-key" 
                v-model="geminiKey" 
                placeholder="AIzaSy..." 
                autocomplete="current-password"
                @input="saveKeys"
              >
              <label for="gemini-model">Model</label>
              <select id="gemini-model" v-model="geminiModel">
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            <div v-show="activeProvider === 'openai'" class="provider-fields">
              <label for="openai-key">OpenAI API Key</label>
              <input 
                type="password" 
                id="openai-key" 
                v-model="openaiKey" 
                placeholder="sk-proj-..." 
                autocomplete="current-password"
                @input="saveKeys"
              >
              <label for="openai-model">Model</label>
              <select id="openai-model" v-model="openaiModel">
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
            </div>
            
            <div class="key-status-row">
              <span :class="['status-indicator', keyStatusClass]">{{ keyStatusText }}</span>
            </div>
          </div>
        </details>
      </div>

      <div class="sidebar-footer">
        <p>by fa33az</p>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="header-title">
          <h2>Workspace</h2>
          <span class="db-badge">{{ dbBadgeText }}</span>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-primary" @click="analyzeQuery">
            Analyze Query
          </button>
        </div>
      </header>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <section class="panel input-panel">
          <div class="panel-header">
            <h3>Query & Plan Input</h3>
          </div>
          <div class="panel-body">
            <div class="editor-container">
              <label>SQL Query <span class="required">*</span></label>
              <!-- Monaco Editor Container -->
              <div id="sql-editor" class="monaco-editor-container"></div>
            </div>
            <div class="editor-container">
              <label>Execution Plan / EXPLAIN Output</label>
              <!-- Monaco Editor Container -->
              <div id="explain-editor" class="monaco-editor-container"></div>
            </div>
          </div>
        </section>

        <!-- Output Panel -->
        <section class="panel output-panel">
          <div class="panel-header tabs-header">
            <div class="tabs">
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-overview' }" 
                @click="selectTab('tab-overview')"
              >
                Ringkasan
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-issues' }" 
                @click="selectTab('tab-issues')"
              >
                Masalah
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-plan' }" 
                @click="selectTab('tab-plan')"
              >
                Plan
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-indexes' }" 
                @click="selectTab('tab-indexes')"
              >
                Index
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-optimized' }" 
                @click="selectTab('tab-optimized')"
              >
                Optimasi
              </button>
            </div>
          </div>

          <div class="panel-body tab-content-container">
            <!-- Loading State -->
            <div v-if="loading" class="loader-overlay">
              <div class="spinner"></div>
              <p>{{ loadingText }}</p>
            </div>

            <!-- Tab: Overview -->
            <div v-show="currentTab === 'tab-overview'" class="tab-content">
              <div class="overview-grid">
                <div class="score-card">
                  <h4>Skor Performa</h4>
                  <div class="score-display">
                    <div class="score-number">{{ results.score !== null ? results.score : '-' }}</div>
                    <div class="score-label" :style="{ color: results.scoreColor }">
                      {{ results.scoreDesc || 'Kirim query untuk dianalisis' }}
                    </div>
                  </div>
                  <div class="score-bar-container">
                    <div 
                      class="score-bar" 
                      :style="{ 
                        width: results.score !== null ? `${(11 - results.score) * 10}%` : '0%',
                        backgroundColor: '#007acc'
                      }"
                    ></div>
                  </div>
                </div>
                
                <div class="quick-summary-card">
                  <h4>Ringkasan Query</h4>
                  <div class="summary-details" v-html="results.summaryHTML"></div>
                </div>
              </div>
              
              <div class="performance-estimates">
                <h4>Estimasi Performa Berdasarkan Skala Data</h4>
                <div class="estimate-cards">
                  <div class="est-card">
                    <h5>Data Kecil</h5>
                    <p class="est-desc">{{ results.estSmallText }}</p>
                  </div>
                  <div class="est-card">
                    <h5>Data Menengah</h5>
                    <p class="est-desc">{{ results.estMedText }}</p>
                  </div>
                  <div class="est-card">
                    <h5>Data Besar</h5>
                    <p class="est-desc">{{ results.estLargeText }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Issues -->
            <div v-show="currentTab === 'tab-issues'" class="tab-content">
              <div class="issues-container">
                <div v-if="results.issues.length === 0" class="placeholder-text">
                  Analisis query kamu terlebih dahulu untuk melihat masalah performa.
                </div>
                <div 
                  v-else 
                  v-for="(issue, index) in results.issues" 
                  :key="index" 
                  :class="['issue-item', issue.severity]"
                >
                  <div class="issue-title">
                    {{ issue.title }} 
                    <span class="issue-severity">{{ issue.severity }}</span>
                  </div>
                  <div class="issue-desc">{{ issue.desc }}</div>
                  <div class="issue-why">
                    <strong>Kenapa memengaruhi performa:</strong> {{ issue.why }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Plan -->
            <div v-show="currentTab === 'tab-plan'" class="tab-content">
              <div class="plan-visualizer-container">
                <div class="plan-header-row">
                  <h4>Visualisasi Execution Plan</h4>
                  <span class="badge">{{ results.planSourceBadge }}</span>
                </div>
                
                <!-- Tree render -->
                <div class="plan-tree">
                  <div v-if="results.visualNodes.length === 0" class="placeholder-text">
                    Masukkan hasil EXPLAIN/EXPLAIN ANALYZE di panel kiri untuk memvisualisasikan.
                  </div>
                  <div v-else>
                    <div 
                      v-for="(node, nIdx) in results.visualNodes" 
                      :key="nIdx"
                      class="plan-node"
                    >
                      <div :class="['node-content', { 'high-cost': node.isExpensive }]">
                        <span class="node-type">{{ node.type }}</span>
                        <span v-if="node.metrics" class="node-metrics">({{ node.metrics }})</span>
                      </div>
                      
                      <!-- Nested children render (up to 3 levels simply) -->
                      <div 
                        v-for="(child1, c1Idx) in node.children" 
                        :key="c1Idx" 
                        class="plan-node"
                        style="padding-left: 1.5rem;"
                      >
                        <div :class="['node-content', { 'high-cost': child1.isExpensive }]">
                          <span class="node-type">{{ child1.type }}</span>
                          <span v-if="child1.metrics" class="node-metrics">({{ child1.metrics }})</span>
                        </div>

                        <div 
                          v-for="(child2, c2Idx) in child1.children" 
                          :key="c2Idx" 
                          class="plan-node"
                          style="padding-left: 1.5rem;"
                        >
                          <div :class="['node-content', { 'high-cost': child2.isExpensive }]">
                            <span class="node-type">{{ child2.type }}</span>
                            <span v-if="child2.metrics" class="node-metrics">({{ child2.metrics }})</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                
                <div class="plan-raw-details mt-4">
                  <h4>Penjelasan Detail Execution Plan</h4>
                  <div v-html="results.planExplainHTML"></div>
                </div>
              </div>
            </div>

            <!-- Tab: Indexes -->
            <div v-show="currentTab === 'tab-indexes'" class="tab-content">
              <div class="indexes-container">
                <div v-if="results.indexes.length === 0" class="placeholder-text">
                  Rekomendasi index akan muncul setelah query dianalisis.
                </div>
                <div 
                  v-else 
                  v-for="(rec, rIdx) in results.indexes" 
                  :key="rIdx" 
                  class="index-card"
                >
                  <div class="index-card-header">
                    <h5>{{ rec.name }}</h5>
                    <span class="badge success">Recommended</span>
                  </div>
                  <div class="index-card-body">
                    <div class="index-sql-wrapper">
                      <button 
                        type="button" 
                        class="copy-btn" 
                        @click="copyText(rec.sql, rIdx)"
                      >
                        {{ copyBtnTexts[rIdx] || 'Copy' }}
                      </button>
                      <pre><code class="language-sql">{{ rec.sql }}</code></pre>
                    </div>
                    <div class="index-impact-grid">
                      <div class="impact-subcard">
                        <h6>Alasan</h6>
                        <p>{{ rec.reason }}</p>
                      </div>
                      <div class="impact-subcard">
                        <h6>Dampak Positif / Negatif</h6>
                        <p>
                          <strong>Positif:</strong> {{ rec.positive }}<br>
                          <strong>Negatif:</strong> {{ rec.negative }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Optimized -->
            <div v-show="currentTab === 'tab-optimized'" class="tab-content">
              <div class="optimized-comparison">
                <div class="diff-container">
                  <div class="diff-pane">
                    <div class="pane-title">Query Asli</div>
                    <!-- Monaco Reader -->
                    <div id="original-output-editor" class="monaco-output-container"></div>
                  </div>
                  <div class="diff-pane">
                    <div class="pane-title pane-title-optimized">Query Optimasi</div>
                    <!-- Monaco Reader -->
                    <div id="optimized-output-editor" class="monaco-output-container"></div>
                  </div>
                </div>
                <div class="optimization-notes mt-4">
                  <h4>Catatan Perubahan & Alasan Optimasi</h4>
                  <div v-html="results.optimizationNotesHTML"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'

// State
const dbEngine = ref('postgresql')
const sqlQuery = ref('')
const explainPlan = ref('')
const activeProvider = ref('gemini')
const geminiKey = ref('')
const geminiModel = ref('gemini-2.5-flash')
const openaiKey = ref('')
const openaiModel = ref('gpt-4o-mini')
const currentTab = ref('tab-overview')
const loading = ref(false)
const loadingText = ref('')

// Database Connection Credentials (Fase 3)
const directConnectEnabled = ref(false)
const dbHost = ref('localhost')
const dbPort = ref('5432')
const dbUser = ref('postgres')
const dbPass = ref('')
const dbName = ref('postgres')
const dbConnectionURI = ref('')

const sampleBtnTexts = reactive({
  sample1: 'Unoptimized JOIN (Postgres)',
  sample2: 'Subquery & Wildcard (MySQL)',
  sample3: 'GROUP BY & Subquery (SQLite)'
})

const copyBtnTexts = reactive({})

const results = reactive({
  score: null,
  scoreDesc: '',
  scoreColor: '',
  summaryHTML: '<p class="placeholder-text">Analisis query kamu terlebih dahulu.</p>',
  estSmallText: '-',
  estMedText: '-',
  estLargeText: '-',
  issues: [],
  planSourceBadge: 'No Plan Loaded',
  visualNodes: [],
  planExplainHTML: '<p class="placeholder-text">Tidak ada data plan.</p>',
  indexes: [],
  originalQuery: '-- Query asli kamu akan muncul di sini',
  optimizedQuery: '-- Query hasil optimasi akan muncul di sini',
  optimizationNotesHTML: '<p class="placeholder-text">Analisis query untuk melihat alasan optimasi.</p>'
})

// Monaco Editor Instances
let sqlEditor = null
let explainEditor = null
let originalOutputEditor = null
let optimizedOutputEditor = null

// Computed
const dbBadgeText = computed(() => {
  const map = {
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    sqlserver: 'Microsoft SQL Server',
    sqlite: 'SQLite',
    oracle: 'Oracle'
  }
  return map[dbEngine.value] || 'Database'
})

const keyStatusClass = computed(() => {
  const hasKey = activeProvider.value === 'gemini' 
    ? geminiKey.value.trim().length > 0 
    : openaiKey.value.trim().length > 0
  return hasKey ? 'online' : 'offline'
})

const keyStatusText = computed(() => {
  const hasKey = activeProvider.value === 'gemini' 
    ? geminiKey.value.trim().length > 0 
    : openaiKey.value.trim().length > 0
  return hasKey 
    ? `Connected via ${activeProvider.value === 'gemini' ? 'Gemini' : 'OpenAI'}`
    : 'Offline Heuristic Only'
})

// Life Cycle Hooks
onMounted(() => {
  // Load AI Keys
  if (localStorage.getItem('qs_gemini_key')) {
    geminiKey.value = localStorage.getItem('qs_gemini_key')
  }
  if (localStorage.getItem('qs_openai_key')) {
    openaiKey.value = localStorage.getItem('qs_openai_key')
  }

  // Load DB Credentials
  if (localStorage.getItem('qs_db_host')) dbHost.value = localStorage.getItem('qs_db_host')
  if (localStorage.getItem('qs_db_port')) dbPort.value = localStorage.getItem('qs_db_port')
  if (localStorage.getItem('qs_db_user')) dbUser.value = localStorage.getItem('qs_db_user')
  if (localStorage.getItem('qs_db_pass')) dbPass.value = localStorage.getItem('qs_db_pass')
  if (localStorage.getItem('qs_db_name')) dbName.value = localStorage.getItem('qs_db_name')
  if (localStorage.getItem('qs_db_conn_uri')) dbConnectionURI.value = localStorage.getItem('qs_db_conn_uri')
  if (localStorage.getItem('qs_db_direct_enabled')) {
    directConnectEnabled.value = localStorage.getItem('qs_db_direct_enabled') === 'true'
  }

  // Dynamically load Monaco Editor loader from CDN
  if (typeof window !== 'undefined') {
    const loaderScript = document.createElement('script')
    loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs/loader.min.js'
    loaderScript.async = true
    loaderScript.onload = () => {
      initMonaco()
    }
    document.head.appendChild(loaderScript)
  }
})

// Monaco Initialization
const initMonaco = () => {
  if (typeof window === 'undefined' || !window.require) return

  window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } })
  window.require(['vs/editor/editor.main'], () => {
    // 1. SQL Input Editor
    const sqlContainer = document.getElementById('sql-editor')
    if (sqlContainer) {
      sqlEditor = window.monaco.editor.create(sqlContainer, {
        value: sqlQuery.value || 'SELECT DISTINCT c.customer_id, c.first_name, c.last_name, o.order_id, o.order_date, o.total_amount\nFROM customers c, orders o\nWHERE c.customer_id = o.customer_id\n  AND LOWER(c.status) = \'active\'\n  AND o.order_date >= \'2025-01-01\'\n  AND o.total_amount > 500\nORDER BY o.total_amount DESC;',
        language: 'sql',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'Consolas, "JetBrains Mono", monospace',
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8
        }
      })
      sqlQuery.value = sqlEditor.getValue()
      sqlEditor.onDidChangeModelContent(() => {
        sqlQuery.value = sqlEditor.getValue()
      })
    }

    // 2. Explain Input Editor
    const explainContainer = document.getElementById('explain-editor')
    if (explainContainer) {
      explainEditor = window.monaco.editor.create(explainContainer, {
        value: explainPlan.value || '',
        language: 'plaintext',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'Consolas, "JetBrains Mono", monospace',
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8
        }
      })
      explainPlan.value = explainEditor.getValue()
      explainEditor.onDidChangeModelContent(() => {
        explainPlan.value = explainEditor.getValue()
      })
    }

    // 3. Original Query Output Editor (ReadOnly)
    const origContainer = document.getElementById('original-output-editor')
    if (origContainer) {
      originalOutputEditor = window.monaco.editor.create(origContainer, {
        value: results.originalQuery,
        language: 'sql',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Consolas, "JetBrains Mono", monospace'
      })
    }

    // 4. Optimized Query Output Editor (ReadOnly)
    const optContainer = document.getElementById('optimized-output-editor')
    if (optContainer) {
      optimizedOutputEditor = window.monaco.editor.create(optContainer, {
        value: results.optimizedQuery,
        language: 'sql',
        theme: 'vs-dark',
        readOnly: true,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Consolas, "JetBrains Mono", monospace'
      })
    }
  })
}

// Methods
const saveKeys = () => {
  localStorage.setItem('qs_gemini_key', geminiKey.value.trim())
  localStorage.setItem('qs_openai_key', openaiKey.value.trim())
}

const saveDBCredentials = () => {
  localStorage.setItem('qs_db_host', dbHost.value.trim())
  localStorage.setItem('qs_db_port', dbPort.value.trim())
  localStorage.setItem('qs_db_user', dbUser.value.trim())
  localStorage.setItem('qs_db_pass', dbPass.value.trim())
  localStorage.setItem('qs_db_name', dbName.value.trim())
  localStorage.setItem('qs_db_conn_uri', dbConnectionURI.value.trim())
  localStorage.setItem('qs_db_direct_enabled', directConnectEnabled.value ? 'true' : 'false')
}

const updateDefaultPort = () => {
  if (dbEngine.value === 'postgresql') {
    dbPort.value = '5432'
    dbUser.value = 'postgres'
  } else if (dbEngine.value === 'mysql') {
    dbPort.value = '3306'
    dbUser.value = 'root'
  }
  saveDBCredentials()
}

const copyText = (text, idx) => {
  navigator.clipboard.writeText(text)
  copyBtnTexts[idx] = 'Copied! ✓'
  setTimeout(() => {
    copyBtnTexts[idx] = 'Copy'
  }, 1500)
}

const selectTab = (tabName) => {
  currentTab.value = tabName
  if (tabName === 'tab-optimized') {
    // Monaco Editors need resize triggers when their container un-hides
    setTimeout(() => {
      if (originalOutputEditor) originalOutputEditor.layout()
      if (optimizedOutputEditor) optimizedOutputEditor.layout()
    }, 80)
  }
}

const samples = {
  sample1: {
    db: 'postgresql',
    sql: `SELECT DISTINCT c.customer_id, c.first_name, c.last_name, o.order_id, o.order_date, o.total_amount\nFROM customers c, orders o\nWHERE c.customer_id = o.customer_id\n  AND LOWER(c.status) = 'active'\n  AND o.order_date >= '2025-01-01'\n  AND o.total_amount > 500\nORDER BY o.total_amount DESC;`,
    explain: `Unique  (cost=1254.34..1289.45 rows=250 width=64) (actual time=45.2..48.7 rows=220 loops=1)\n  ->  Sort  (cost=1254.34..1265.12 rows=431 width=64) (actual time=45.1..46.2 rows=430 loops=1)\n        Sort Key: o.total_amount DESC, c.customer_id, c.first_name, c.last_name, o.order_id, o.order_date\n        Sort Method: quicksort  Memory: 95kB\n        ->  Hash Join  (cost=350.25..1232.10 rows=431 width=64) (actual time=8.2..42.1 rows=430 loops=1)\n              Hash Cond: (o.customer_id = c.customer_id)\n              ->  Seq Scan on orders o  (cost=0.00..855.00 rows=5200 width=32) (actual time=0.01..28.4 rows=5150 loops=1)\n                    Filter: ((order_date >= '2025-01-01'::date) AND (total_amount > '500'::numeric))\n                    Rows Removed by Filter: 14850\n              ->  Hash  (cost=312.50..312.50 rows=3020 width=36) (actual time=7.9..7.9 rows=3000 loops=1)\n                    Buckets: 4096  Batches: 1  Memory Usage: 220kB\n                    ->  Seq Scan on customers c  (cost=0.00..312.50 rows=3020 width=36) (actual time=0.02..6.8 rows=3000 loops=1)\n                          Filter: (lower((status)::text) = 'active'::text)\n                          Rows Removed by Filter: 7000`
  },
  sample2: {
    db: 'mysql',
    sql: `SELECT * \nFROM employees \nWHERE department_id IN (\n    SELECT department_id \n    FROM departments \n    WHERE location_name LIKE '%Jakarta%'\n) AND email LIKE '%gmail.com'\nORDER BY hire_date DESC;`,
    explain: `+----+-------------+-------------+------------+------+-------------------+---------+---------+-------+------+----------+------------------------------------+\n| id | select_type | table       | partitions | type | possible_keys     | key     | key_len | ref   | rows | filtered | Extra                              |\n+----+-------------+-------------+------------+------+-------------------+---------+---------+-------+------+----------+------------------------------------+\n|  1 | SIMPLE      | departments | NULL       | ALL  | PRIMARY           | NULL    | NULL    | NULL  |  150 |    11.11 | Using where; Using temporary; Sort |\n|  1 | SIMPLE      | employees   | NULL       | ref  | idx_dept_email    | fk_dept | 5       | dept  | 1200 |    10.00 | Using index condition; Using where |\n+----+-------------+-------------+------------+------+-------------------+---------+---------+-------+------+----------+------------------------------------+`
  },
  sample3: {
    db: 'sqlite',
    sql: `SELECT p.product_name, SUM(oi.quantity * oi.price) as total_sales\nFROM products p\nJOIN order_items oi ON p.product_id = oi.product_id\nWHERE p.category_id = (SELECT category_id FROM categories WHERE category_name = 'Electronics')\nGROUP BY p.product_name\nHAVING total_sales > 1000;`,
    explain: `SCAN TABLE products AS p\nSCATTER SUBQUERY 1\n  SCAN TABLE categories\nSEARCH TABLE order_items AS oi USING INDEX idx_oi_product (product_id=?)\nUSE TEMP B-TREE FOR GROUP BY`
  }
}

const loadSample = (key) => {
  const sample = samples[key]
  dbEngine.value = sample.db
  sqlQuery.value = sample.sql
  explainPlan.value = sample.explain
  
  if (sqlEditor) sqlEditor.setValue(sample.sql)
  if (explainEditor) explainEditor.setValue(sample.explain)
  
  sampleBtnTexts[key] = 'Loaded! ✓'
  setTimeout(() => {
    const originalNames = {
      sample1: 'Unoptimized JOIN (Postgres)',
      sample2: 'Subquery & Wildcard (MySQL)',
      sample3: 'GROUP BY & Subquery (SQLite)'
    }
    sampleBtnTexts[key] = originalNames[key]
  }, 1500)
}

const analyzeQuery = async () => {
  const sql = sqlQuery.value.trim()
  let explain = explainPlan.value.trim()
  
  if (!sql) {
    alert('Silakan masukkan query SQL terlebih dahulu.')
    return
  }

  loading.value = true
  
  // Direct Explain Connection logic (Fase 3)
  if (directConnectEnabled.value) {
    loadingText.value = 'Connecting to database and executing EXPLAIN...'
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine: dbEngine.value,
          host: dbHost.value,
          port: dbPort.value,
          user: dbUser.value,
          password: dbPass.value,
          database: dbName.value,
          connectionString: dbConnectionURI.value,
          query: sql
        })
      })

      const data = await response.json()
      if (data.success) {
        explain = data.plan
        explainPlan.value = data.plan
        if (explainEditor) explainEditor.setValue(data.plan)
      } else {
        alert(`Failed to fetch database explain plan: ${data.message}`)
        loading.value = false
        return
      }
    } catch (e) {
      alert(`Database connection failed: ${e.message}`)
      loading.value = false
      return
    }
  }

  loadingText.value = 'Menghubungkan ke Engine Analisis...'

  const hasKey = activeProvider.value === 'gemini' 
    ? geminiKey.value.trim().length > 0 
    : openaiKey.value.trim().length > 0

  try {
    if (hasKey) {
      loadingText.value = 'AI sedang membedah Query & Execution Plan kamu...'
      await runAIAnalysis(sql, explain, dbEngine.value)
    } else {
      loadingText.value = 'Menjalankan Analisis Heuristik Offline...'
      await new Promise(resolve => setTimeout(resolve, 800))
      runOfflineAnalysis(sql, explain, dbEngine.value)
    }
  } catch (error) {
    console.error(error)
    alert(`Gagal menganalisis query: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// AI Connector Flow
const runAIAnalysis = async (sql, explain, engine) => {
  const provider = activeProvider.value
  const key = provider === 'gemini' ? geminiKey.value.trim() : openaiKey.value.trim()
  const model = provider === 'gemini' ? geminiModel.value : openaiModel.value

  const prompt = `Anda adalah AI SQL Performance Engineer yang ahli dalam optimasi query SQL untuk PostgreSQL, MySQL, SQL Server, SQLite, dan Oracle.
Tugas utama Anda adalah menganalisis query SQL dan memberikan rekomendasi optimasi tanpa mengubah hasil atau logika bisnis dari query tersebut.

Database Engine yang digunakan: ${engine}

=== SQL QUERY ===
${sql}

=== EXECUTION PLAN / EXPLAIN OUTPUT ===
${explain || 'Tidak ada execution plan yang disediakan.'}

Instruksi Output:
Analisis query tersebut dan berikan tanggapan menggunakan Bahasa Indonesia dengan format markdown persis seperti berikut ini. Pastikan Anda menyertakan pembagi header '#' persis di bawah agar sistem kami dapat mem-parsing data Anda dengan benar. Jangan menambahkan pengantar meta atau penutup di luar struktur ini:

# Ringkasan Query
[Berikan deskripsi singkat tentang tujuan query, tabel yang digunakan, jenis JOIN, kondisi WHERE, GROUP BY, ORDER BY, subquery/CTE, dan fungsi agregasi yang dipakai.]

# Masalah Performa
[Jelaskan masalah performa yang terdeteksi, seperti Full Table Scan, SELECT *, unindexed join, fungsi pada kolom index, LIKE dengan wildcard di depan, nested subquery, DISTINCT yang mubazir, dll. Jelaskan mengapa masing-masing memengaruhi performa.]

# Penjelasan Execution Plan
[Jika pengguna memberikan execution plan, jelaskan setiap node, operasi termahal, estimated/actual cost/time/rows, dan scan/join type yang digunakan. Jika tidak ada, sebutkan estimasi scan yang kemungkinan dilakukan database engine.]

# Rekomendasi Index
[Berikan rekomendasi index. Untuk setiap index, tampilkan perintah SQL pembuatannya, alasan, query yang terbantu, dampak performa, dan dampak negatif terhadap write performance / storage.]
Contoh format:
\`\`\`sql
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);
\`\`\`
Alasan: ...
Dampak Positif: ...
Dampak Negatif: ...

# Optimasi Query
[Berikan versi query SQL yang lebih efisien di dalam block SQL. Jelaskan alasan logis untuk setiap optimasi yang Anda buat.]

# Skor Performa
[Berikan skor 1 (Sangat Baik) sampai 10 (Sangat Buruk) dalam format 'Skor Performa: X'. Berikan penjelasan terpisah untuk performa pada Data Kecil, Data Menengah, dan Data Besar.]`

  let resultText = ''

  if (provider === 'gemini') {
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error?.message || 'Gemini API Error')
    }

    const data = await response.json()
    resultText = data.candidates[0].content.parts[0].text
  } else {
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions'
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'Anda adalah AI SQL Performance Engineer profesional.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error?.message || 'OpenAI API Error')
    }

    const data = await response.json()
    resultText = data.choices[0].message.content
  }

  parseAndPopulateAIResponse(resultText, sql, explain, engine)
}

const parseAndPopulateAIResponse = (mdText, originalSql, explain, engine) => {
  const sections = {
    summary: '',
    issues: '',
    plan: '',
    indexes: '',
    optimized: '',
    score: ''
  }

  const parts = mdText.split(/(?=# (?:Ringkasan Query|Masalah Performa|Penjelasan Execution Plan|Rekomendasi Index|Optimasi Query|Skor Performa))/i)
  
  parts.forEach(part => {
    const trimmed = part.trim()
    if (trimmed.startsWith('# Ringkasan Query')) {
      sections.summary = trimmed.replace('# Ringkasan Query', '').trim()
    } else if (trimmed.startsWith('# Masalah Performa')) {
      sections.issues = trimmed.replace('# Masalah Performa', '').trim()
    } else if (trimmed.startsWith('# Penjelasan Execution Plan')) {
      sections.plan = trimmed.replace('# Penjelasan Execution Plan', '').trim()
    } else if (trimmed.startsWith('# Rekomendasi Index')) {
      sections.indexes = trimmed.replace('# Rekomendasi Index', '').trim()
    } else if (trimmed.startsWith('# Optimasi Query')) {
      sections.optimized = trimmed.replace('# Optimasi Query', '').trim()
    } else if (trimmed.startsWith('# Skor Performa')) {
      sections.score = trimmed.replace('# Skor Performa', '').trim()
    }
  })

  // Fill structure
  results.summaryHTML = formatMarkdownToHTML(sections.summary || 'AI tidak menghasilkan ringkasan.')
  results.issues = parseIssuesFromMarkdown(sections.issues)
  results.indexes = parseIndexesFromMarkdown(sections.indexes)
  results.originalQuery = originalSql

  // Parse Score
  let scoreNum = 5
  const scoreMatch = sections.score.match(/Skor\s+Performa:\s*(\d+)/i) || mdText.match(/Skor\s+Performa:\s*(\d+)/i)
  if (scoreMatch) {
    scoreNum = parseInt(scoreMatch[1], 10)
  }
  updateScoreCardValues(scoreNum, sections.score)

  // Plan Visualizer
  results.planSourceBadge = explain ? 'Pasted Execution Plan' : 'AI Estimate Only'
  if (explain) {
    results.visualNodes = parseVisualPlanNodes(explain, engine)
  } else {
    results.visualNodes = []
  }
  results.planExplainHTML = formatMarkdownToHTML(sections.plan || 'Tidak ada detail execution plan.')

  // Optimized query extraction
  const sqlBlockRegex = /```sql([\s\S]*?)```/i
  const match = sections.optimized.match(sqlBlockRegex)
  if (match) {
    results.optimizedQuery = match[1].trim()
    const remainingNotes = sections.optimized.replace(sqlBlockRegex, '').trim()
    results.optimizationNotesHTML = formatMarkdownToHTML(remainingNotes || 'Query dioptimasi demi efisiensi.')
  } else {
    results.optimizedQuery = originalSql
    results.optimizationNotesHTML = formatMarkdownToHTML(sections.optimized || 'Query dioptimasi demi efisiensi.')
  }

  // Update output editors
  if (originalOutputEditor) originalOutputEditor.setValue(results.originalQuery)
  if (optimizedOutputEditor) optimizedOutputEditor.setValue(results.optimizedQuery)

  currentTab.value = 'tab-overview'
}

// Helpers
const updateScoreCardValues = (score, scoreText = '') => {
  results.score = score
  
  let desc = ''
  let color = ''
  if (score <= 3) {
    desc = 'Sangat Baik (Optimized) 🚀'
    color = '#007acc'
  } else if (score <= 6) {
    desc = 'Sedang (Butuh Perbaikan) ⚠️'
    color = '#cca700'
  } else {
    desc = 'Buruk (Bahaya Latensi Tinggi) 🚨'
    color = '#f44747'
  }
  
  results.scoreDesc = desc
  results.scoreColor = color

  if (scoreText) {
    const smallMatch = scoreText.match(/Data Kecil:?\s*([^\n]+)/i) || []
    const medMatch = scoreText.match(/Data Menengah:?\s*([^\n]+)/i) || []
    const largeMatch = scoreText.match(/Data Besar:?\s*([^\n]+)/i) || []

    results.estSmallText = smallMatch[1] || (score <= 3 ? 'Sangat cepat (< 5ms). Beban minimal.' : 'Cepat (< 20ms) karena volume data kecil masih bisa tertampung memori.')
    results.estMedText = medMatch[1] || (score <= 3 ? 'Cepat (< 50ms) berkat index.' : 'Latensi terasa meningkat (100ms - 500ms). Full table scan mulai membebani disk.')
    results.estLargeText = largeMatch[1] || (score <= 3 ? 'Tetap stabil (< 200ms).' : 'Sangat lambat (> 2 detik). Resiko CPU spikes dan timeout pada database.')
  }
}

// Offline / Heuristic Flow
const runOfflineAnalysis = (sql, explain, engine) => {
  const issues = []
  let score = 1
  const lowerSql = sql.toLowerCase()

  // Heuristics checks
  if (/\bselect\s+\*\b/.test(lowerSql)) {
    issues.push({
      severity: 'medium',
      title: 'Penggunaan SELECT *',
      desc: 'Mengambil semua kolom dari tabel meskipun tidak semuanya diperlukan.',
      why: 'SELECT * memperlambat query karena meningkatkan beban I/O jaringan, menghalangi database untuk memanfaatkan Index-Only Scan, dan mengonsumsi memori lebih besar pada server aplikasi.'
    })
    score += 2
  }

  if (/\blike\s+['"]%/.test(lowerSql)) {
    issues.push({
      severity: 'high',
      title: 'Leading Wildcard pada Clause LIKE',
      desc: 'Pencarian kata kunci menggunakan pattern awal persen (\'%keyword\').',
      why: 'Penggunaan wildcard di depan kolom menghalangi database engine untuk menggunakan B-Tree index scan konvensional, sehingga memaksa database untuk melakukan Full Table Scan (atau Sequential Scan) yang sangat lambat pada tabel berukuran besar.'
    })
    score += 3
  }

  const funcRegex = /\bwhere\s+(?:lower|upper|year|month|date|coalesce|concat|substring|trim)\s*\(/i
  if (funcRegex.test(lowerSql)) {
    issues.push({
      severity: 'high',
      title: 'Fungsi Manipulasi Kolom pada Predicate WHERE',
      desc: 'Membungkus nama kolom di dalam fungsi (misal: LOWER(column), YEAR(column)).',
      why: 'Penerapan fungsi pada kolom langsung membatalkan penggunaan index B-Tree standar pada kolom tersebut. Database harus mengevaluasi fungsi untuk setiap baris (Full Table Scan) kecuali jika Anda membuat Functional/Expression Index.'
    })
    score += 2
  }

  if (/\bfrom\s+\w+\s*,\s*\w+/.test(lowerSql) && !/\bwhere\b/.test(lowerSql)) {
    issues.push({
      severity: 'high',
      title: 'Cartesian Join (Cross Join) Tanpa Filter',
      desc: 'Menggabungkan tabel menggunakan format koma tanpa klausa join atau WHERE.',
      why: 'Ini akan menghasilkan Cartesian Product (M x N baris), mengonsumsi memori server secara drastis, dan sering kali membuat database kehabisan memori atau mengalami crash.'
    })
    score += 4
  } else if (/\bfrom\s+\w+\s*,\s*\w+/.test(lowerSql)) {
    issues.push({
      severity: 'medium',
      title: 'Implicit JOIN (Syntax ANSI-89)',
      desc: 'Menggabungkan tabel di klausa FROM dengan pemisah koma.',
      why: 'Meskipun optimizer modern dapat menerjemahkannya ke INNER JOIN, penulisan ini sangat rentan terhadap kesalahan ketik (lupa join key) yang berakibat Cartesian Join, serta mengurangi keterbacaan query dibanding ANSI-92 JOIN (JOIN ... ON).'
    })
    score += 1
  }

  if (/\boffset\s+\d+/.test(lowerSql)) {
    const offsetVal = parseInt(lowerSql.match(/\boffset\s+(\d+)/)[1], 10)
    if (offsetVal > 1000) {
      issues.push({
        severity: 'medium',
        title: 'OFFSET Terlalu Besar',
        desc: `Query melompati data sebanyak ${offsetVal} baris.`,
        why: 'OFFSET mengharuskan database memindai semua baris sebelumnya dan membuangnya sebelum mengembalikan baris yang diinginkan. Untuk dataset besar, OFFSET tinggi akan merusak performa. Solusinya adalah Keyset Pagination (Seek Method).'
      })
      score += 2
    }
  }

  if ((lowerSql.match(/\bselect\b/g) || []).length > 2) {
    issues.push({
      severity: 'medium',
      title: 'Subquery Bertingkat',
      desc: 'Ditemukan beberapa subquery di dalam query utama.',
      why: 'Subquery bertingkat (terutama correlated subquery) dapat menyebabkan database mengeksekusi subquery tersebut secara berulang untuk setiap baris query luar, menurunkan performa secara eksponensial. Lebih disarankan menggunakan JOIN atau CTE.'
    })
    score += 1
  }

  if (/\bselect\s+distinct\b/.test(lowerSql)) {
    issues.push({
      severity: 'low',
      title: 'Penggunaan DISTINCT',
      desc: 'Menyaring baris duplikat secara eksplisit.',
      why: 'DISTINCT memaksa database melakukan operasi sorting atau hashing di memori/disk untuk mencari duplikasi. Jika relasi database terjamin unik melalui join keys/primary keys, DISTINCT tidak diperlukan.'
    })
    score += 1
  }

  score = Math.min(score, 10)
  updateScoreCardValues(score)

  // Populate structural summary
  results.summaryHTML = parseStructuralSummary(sql)
  results.issues = issues
  results.indexes = parseOfflineIndexRecommendations(sql, engine, issues)
  results.originalQuery = sql
  results.optimizedQuery = parseOfflineOptimizedQuery(sql, issues)
  results.optimizationNotesHTML = parseOfflineExplanation(issues)

  // Update output editors
  if (originalOutputEditor) originalOutputEditor.setValue(results.originalQuery)
  if (optimizedOutputEditor) optimizedOutputEditor.setValue(results.optimizedQuery)

  // Plan Visualizer
  results.planSourceBadge = explain ? 'Heuristic Parsed Plan' : 'No Plan Provided'
  if (explain) {
    results.visualNodes = parseVisualPlanNodes(explain, engine)
    results.planExplainHTML = `<p>Telah dilakukan parsing lokal terhadap <strong>${engine.toUpperCase()}</strong> execution plan yang Anda masukkan. Lihat panel visualisasi di atas untuk detail hierarki scan.</p>`
  } else {
    results.visualNodes = []
    results.planExplainHTML = `<p>Tidak ada data plan yang diinputkan. Database kemungkinan besar akan menggunakan sequential scan jika volume data besar dan index tidak tersedia pada query tersebut.</p>`
  }

  currentTab.value = 'tab-overview'
}

// Offline Parsers
const parseStructuralSummary = (sql) => {
  const tables = []
  const joins = []
  const whereConds = []
  
  const fromMatch = sql.match(/\bfrom\s+([a-zA-Z0-9_,\s\(\)]+)/i)
  if (fromMatch) {
    const tableList = fromMatch[1].split(',')
    tableList.forEach(t => {
      const name = t.trim().split(/\s+/)[0]
      if (name && !['select', 'where', 'join', 'left', 'right', 'inner'].includes(name.toLowerCase())) {
        tables.push(name)
      }
    })
  }

  const joinMatches = sql.matchAll(/\b(left|right|inner|cross)?\s*join\s+([a-zA-Z0-9_]+)/gi)
  for (const match of joinMatches) {
    joins.push(`${match[1] ? match[1].toUpperCase() : 'INNER'} JOIN pada ${match[2]}`)
    tables.push(match[2])
  }

  const whereMatch = sql.match(/\bwhere\s+([\s\S]+?)(?:\bgroup\s+by\b|\border\s+by\b|\blimit\b|\boffset\b|$)/i)
  if (whereMatch) {
    whereConds.push(whereMatch[1].trim())
  }

  const cleanTables = [...new Set(tables)]

  return `
    <h5>Struktur Query Terdeteksi:</h5>
    <ul>
      <li><strong>Tabel Terlibat:</strong> ${cleanTables.length > 0 ? cleanTables.join(', ') : 'Tidak dapat diidentifikasi secara pasti'}</li>
      <li><strong>Metode Join:</strong> ${joins.length > 0 ? joins.join(', ') : 'Tidak menggunakan ANSI JOIN (Single Table atau Cartesian implicit)'}</li>
      <li><strong>Kondisi Filter (WHERE):</strong> <code>${whereConds.length > 0 ? whereConds[0] : 'Tidak ada filter pencarian'}</code></li>
      <li><strong>Fungsi Agregasi:</strong> ${/\b(sum|avg|count|max|min)\b/i.test(sql) ? 'Ya (Terdeteksi)' : 'Tidak terdeteksi'}</li>
    </ul>
  `
}

const parseOfflineIndexRecommendations = (sql, engine, issues) => {
  const indexRecs = []
  const addedFields = new Set()
  
  const joinOnConds = sql.matchAll(/([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/gi)
  for (const match of joinOnConds) {
    const table1 = match[1], col1 = match[2], table2 = match[3], col2 = match[4]
    
    if (col1 && !addedFields.has(`${table1}_${col1}`)) {
      indexRecs.push({
        name: `idx_${table1}_${col1}`,
        sql: `CREATE INDEX idx_${table1}_${col1}\nON ${table1}(${col1});`,
        reason: `Membantu proses JOIN dengan mempercepat pencarian data relasional pada kolom key: ${col1}.`,
        positive: `Mengubah index scan dari Nested Loop / Hash Join Full Scan menjadi Index Lookup yang efisien.`,
        negative: `Menambah memori penyimpanan dan sedikit menurunkan performa INSERT/UPDATE pada tabel ${table1}.`
      })
      addedFields.add(`${table1}_${col1}`)
    }
    if (col2 && !addedFields.has(`${table2}_${col2}`)) {
      indexRecs.push({
        name: `idx_${table2}_${col2}`,
        sql: `CREATE INDEX idx_${table2}_${col2}\nON ${table2}(${col2});`,
        reason: `Membantu proses JOIN dengan mempercepat pencarian data relasional pada kolom key: ${col2}.`,
        positive: `Menghindari sequential table scan pada baris relasi join.`,
        negative: `Menambah ukuran data index di disk.`
      })
      addedFields.add(`${table2}_${col2}`)
    }
  }

  const whereFieldMatches = sql.matchAll(/([a-zA-Z0-9_]+)\s*=\s*(?:'[^']*'|\d+)/gi)
  for (const match of whereFieldMatches) {
    const col = match[1]
    let tableGuess = 'table_name'
    const tablesInSql = sql.match(/\bfrom\s+([a-zA-Z0-9_]+)/i)
    if (tablesInSql) tableGuess = tablesInSql[1]

    if (col && !['and', 'or', 'where', 'select'].includes(col.toLowerCase()) && !addedFields.has(`${tableGuess}_${col}`)) {
      indexRecs.push({
        name: `idx_${tableGuess}_${col}`,
        sql: `CREATE INDEX idx_${tableGuess}_${col}\nON ${tableGuess}(${col});`,
        reason: `Mempercepat filter pencarian (equality check) pada kolom WHERE: ${col}.`,
        positive: `Database dapat langsung melompat ke baris yang dicocokkan.`,
        negative: `Overhead tambahan saat modifikasi data.`
      })
      addedFields.add(`${tableGuess}_${col}`)
    }
  }

  return indexRecs
}

const parseOfflineOptimizedQuery = (sql, issues) => {
  let optimized = sql
  if (/\bselect\s+\*\b/i.test(optimized)) {
    optimized = optimized.replace(/\bselect\s+\*\b/i, 'SELECT c.customer_id, c.first_name, o.order_id, o.order_date, o.total_amount -- Direkomendasikan mengganti * dengan kolom spesifik')
  }

  if (/\bfrom\s+(\w+)\s+(\w+)\s*,\s*(\w+)\s+(\w+)\b/i.test(optimized) && /\bwhere\s+\w+\.\w+\s*=\s*\w+\.\w+/i.test(optimized)) {
    const match = optimized.match(/\bfrom\s+(\w+)\s+(\w+)\s*,\s*(\w+)\s+(\w+)\b/i)
    const tbl1 = match[1], alias1 = match[2], tbl2 = match[3], alias2 = match[4]
    
    const joinCondMatch = optimized.match(/where\s+([\w\.]+)\s*=\s*([\w\.]+)/i)
    if (joinCondMatch) {
      const joinCond = joinCondMatch[0].replace(/where\s+/i, '')
      optimized = optimized.replace(/\bfrom\s+(\w+)\s+(\w+)\s*,\s*(\w+)\s+(\w+)\b/i, `FROM ${tbl1} ${alias1}\nJOIN ${tbl2} ${alias2} ON ${joinCond}`)
      optimized = optimized.replace(joinCondMatch[0], 'WHERE')
      optimized = optimized.replace(/\bwhere\s+and\b/i, 'WHERE')
      optimized = optimized.replace(/\bwhere\s*$/i, '')
    }
  }

  if (/lower\(\s*([a-zA-Z0-9_\.]+)\s*\)\s*=\s*'([a-zA-Z0-9_]+)'/i.test(optimized)) {
    optimized = optimized.replace(/lower\(\s*([a-zA-Z0-9_\.]+)\s*\)\s*=\s*'([a-zA-Z0-9_]+)'/i, '$1 = \'$2\'')
  }

  if (/\bselect\s+distinct\b/i.test(optimized)) {
    optimized = optimized.replace(/\bselect\s+distinct\b/i, 'SELECT /* Hapus DISTINCT jika key gabungan sudah dijamin unik */')
  }

  return optimized
}

const parseOfflineExplanation = (issues) => {
  if (issues.length === 0) {
    return '<p>Tidak ada perubahan penting yang diidentifikasi secara otomatis oleh engine offline.</p>'
  }

  let html = '<h5>Perubahan yang Direkomendasikan:</h5><ul>'
  issues.forEach(issue => {
    if (issue.title.includes('SELECT *')) {
      html += '<li><strong>Mengganti SELECT * dengan Kolom Spesifik:</strong> Mengurangi I/O disk dan jaringan, mempermudah database engine menggunakan Index-Only Scan.</li>'
    }
    if (issue.title.includes('Implicit JOIN')) {
      html += '<li><strong>Mengganti Koma dengan ANSI-92 INNER JOIN:</strong> Memisahkan logika relasional (ON) dengan kriteria filter (WHERE) sehingga query lebih rapi dan mencegah resiko Cartesian Join.</li>'
    }
    if (issue.title.includes('Kondisi WHERE')) {
      html += '<li><strong>Mencegah Pemakaian Fungsi pada Kolom WHERE:</strong> Mengubah `LOWER(c.status) = \'active\'` menjadi pencocokan langsung `c.status = \'active\'` (atau menggunakan case-insensitive collation) agar index dapat terbaca oleh B-Tree.</li>'
    }
    if (issue.title.includes('LIKE')) {
      html += '<li><strong>Menghindari Leading Wildcard:</strong> Gunakan `LIKE \'keyword%\'` (trailing wildcard) jika memungkinkan, atau beralih ke Full-Text Search (FTS) index agar pencarian tidak memaksa Full Table Scan.</li>'
    }
  })
  html += '</ul>'
  return html
}

// Markdown parser
const formatMarkdownToHTML = (md) => {
  if (!md) return '<p class="placeholder-text">Tidak ada data.</p>'
  
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```sql([\s\S]*?)```/g, '<div class="code-wrapper-container"><button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText); this.innerText=\'Copied!\'; setTimeout(() => this.innerText=\'Copy\', 1000)">Copy</button><pre><code class="language-sql">$1</code></pre></div>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^#### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/<\/li>\s*<li>/g, '</li><li>')

  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<ul') || p.trim().startsWith('<pre') || p.trim().startsWith('<div')) {
      return p
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`
  }).join('')

  return html
}

const parseIssuesFromMarkdown = (issuesMd) => {
  if (!issuesMd) return []
  const parsed = []
  
  const listItems = issuesMd.match(/-\s+\*\*([^*]+)\*\*:\s*([^\n]+)/g) || []
  listItems.forEach(item => {
    const match = item.match(/-\s+\*\*([^*]+)\*\*:\s*([^\n]+)/)
    if (match) {
      parsed.push({
        severity: match[1].toLowerCase().includes('tinggi') || match[1].toLowerCase().includes('high') ? 'high' : 'medium',
        title: match[1],
        desc: match[2],
        why: 'Diidentifikasi oleh AI Performance Agent.'
      })
    }
  })

  if (parsed.length === 0) {
    parsed.push({
      severity: 'medium',
      title: 'Performance Issues',
      desc: 'Klik tab Masalah Performa untuk membaca rincian lengkap dari AI.',
      why: issuesMd
    })
  }

  return parsed
}

const parseIndexesFromMarkdown = (indexesMd) => {
  if (!indexesMd) return []
  const parsed = []
  
  const blocks = indexesMd.split(/(?=CREATE INDEX|idx_)/i)
  blocks.forEach((block, idx) => {
    const sqlMatch = block.match(/```sql([\s\S]*?)```/i) || block.match(/(CREATE INDEX[\s\S]+?;)/i)
    if (sqlMatch) {
      const sql = sqlMatch[1].trim()
      const nameMatch = sql.match(/CREATE INDEX\s+([a-zA-Z0-9_]+)/i)
      const name = nameMatch ? nameMatch[1] : `idx_recommendation_${idx + 1}`
      
      const reasonMatch = block.match(/Alasan:?\s*([^\n]+)/i) || []
      const impactPos = block.match(/Dampak Positif:?\s*([^\n]+)/i) || []
      const impactNeg = block.match(/Dampak Negatif:?\s*([^\n]+)/i) || []

      parsed.push({
        name: name,
        sql: sql,
        reason: reasonMatch[1] || 'Membantu filtering query.',
        positive: impactPos[1] || 'Mempercepat lookup index.',
        negative: impactNeg[1] || 'Overhead penulisan disk.'
      })
    }
  })

  return parsed
}

// Visual Plan Parser
const parseVisualPlanNodes = (explainText, engine) => {
  const lines = explainText.split('\n').filter(l => l.trim().length > 0)
  const rootNodes = []

  if (engine === 'postgresql') {
    const stack = []
    lines.forEach(line => {
      const matchSpaces = line.match(/^(\s*)/)
      const depth = matchSpaces ? matchSpaces[1].length : 0
      
      const cleanLine = line.trim().replace(/^->\s+/, '')
      const opMatch = cleanLine.match(/^([A-Za-z\s]+)(?:\s+\(|_)/)
      const nodeType = opMatch ? opMatch[1].trim() : cleanLine.split('(')[0].trim()
      const metricsMatch = cleanLine.match(/\(([^)]+)\)/)
      const metrics = metricsMatch ? metricsMatch[1].trim() : ''

      const isExpensive = nodeType.toLowerCase().includes('seq scan') || 
                          nodeType.toLowerCase().includes('table scan') || 
                          (metrics.includes('actual time=') && parseFloat((metrics.match(/actual time=\d+\.\d+\..(\d+\.\d+)/) || [])[1]) > 100)

      const nodeObj = {
        type: nodeType,
        metrics: metrics,
        isExpensive: isExpensive,
        children: []
      }

      if (depth === 0) {
        rootNodes.push(nodeObj)
        stack[0] = nodeObj
      } else {
        let parentIdx = Math.floor((depth - 2) / 2)
        if (parentIdx < 0) parentIdx = 0
        const parent = stack[parentIdx]
        if (parent) {
          parent.children.push(nodeObj)
          stack[parentIdx + 1] = nodeObj
        } else {
          const lastRoot = rootNodes[rootNodes.length - 1]
          if (lastRoot) lastRoot.children.push(nodeObj)
          else rootNodes.push(nodeObj)
        }
      }
    })
  } else if (engine === 'mysql') {
    lines.forEach(line => {
      if (line.includes('|') && !line.includes('id') && !line.includes('---')) {
        const cols = line.split('|').map(c => c.trim()).filter(c => c.length > 0)
        if (cols.length >= 5) {
          rootNodes.push({
            type: `Table: ${cols[2]} (${cols[4].toUpperCase()})`,
            metrics: `Key: ${cols[6] || 'NULL'} | Est Rows: ${cols[9]} | Extra: ${cols[11] || ''}`,
            isExpensive: cols[4].toUpperCase() === 'ALL' || (cols[11] && (cols[11].toLowerCase().includes('temporary') || cols[11].toLowerCase().includes('filesort'))),
            children: []
          })
        }
      }
    })
  }

  if (rootNodes.length === 0) {
    lines.forEach(line => {
      rootNodes.push({
        type: line.trim(),
        metrics: '',
        isExpensive: line.toLowerCase().includes('scan') || line.toLowerCase().includes('all') || line.toLowerCase().includes('temp'),
        children: []
      })
    })
  }

  return rootNodes
}
</script>
