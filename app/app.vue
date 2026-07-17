<template>
  <div class="app-container">
    <!-- Sidebar Settings & Config -->
    <aside class="sidebar">
      <div class="brand">
        <img src="/logo.png" alt="QuerySage Logo" class="brand-logo-img">
      </div>

      <!-- Language Selector -->
      <div class="sidebar-section">
        <h3>Language / Bahasa</h3>
        <div class="select-wrapper">
          <select id="app-lang" v-model="currentLang" @change="saveLanguagePreference">
            <option value="en">English (US)</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </div>
      </div>

      <!-- Quick Samples -->
      <div class="sidebar-section">
        <h3>{{ t.quickSamples }}</h3>
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
        <h3>{{ t.dbEngine }}</h3>
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
          <summary class="config-summary">{{ t.directDB }}</summary>
          <div class="config-details-content">
            <label class="checkbox-label">
              <input type="checkbox" v-model="directConnectEnabled" @change="saveDBCredentials">
              {{ t.enableAuto }}
            </label>
            
            <div v-show="directConnectEnabled" class="provider-fields">
              <label for="db-host">{{ t.host }}</label>
              <input type="text" id="db-host" v-model="dbHost" placeholder="localhost" @input="saveDBCredentials">
              
              <label for="db-port">{{ t.port }}</label>
              <input type="text" id="db-port" v-model="dbPort" placeholder="5432 / 3306" @input="saveDBCredentials">
              
              <label for="db-user">{{ t.user }}</label>
              <input type="text" id="db-user" v-model="dbUser" placeholder="postgres" @input="saveDBCredentials">
              
              <label for="db-pass">{{ t.pass }}</label>
              <input type="password" id="db-pass" v-model="dbPass" placeholder="******" autocomplete="current-password" @input="saveDBCredentials">
              
              <label for="db-name">{{ t.dbName }}</label>
              <input type="text" id="db-name" v-model="dbName" placeholder="my_db" @input="saveDBCredentials">
              
              <label for="db-uri">{{ t.connURI }}</label>
              <input type="text" id="db-uri" v-model="dbConnectionURI" placeholder="postgresql://user:pass@host:port/db" @input="saveDBCredentials">
            </div>
          </div>
        </details>
      </div>

      <!-- Collapsible Settings to reduce clutter -->
      <div class="sidebar-section">
        <details class="config-details">
          <summary class="config-summary">{{ t.aiConfig }}</summary>
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
              <label for="gemini-model">{{ t.model }}</label>
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
              <label for="openai-model">{{ t.model }}</label>
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
        <a href="https://github.com/fa33az/querysage" target="_blank" rel="noopener noreferrer" class="github-link">
          <svg class="github-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>fa33az</span>
        </a>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="header-title">
          <h2>{{ t.workspace }}</h2>
          <span class="db-badge">{{ dbBadgeText }}</span>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-primary" @click="analyzeQuery">
            {{ t.analyzeQuery }}
          </button>
        </div>
      </header>

      <div class="workspace-grid">
        <!-- Input Panel -->
        <section class="panel input-panel">
          <div class="panel-header">
            <h3>{{ t.queryPlanInput }}</h3>
          </div>
          <div class="panel-body">
            <div class="editor-container">
              <label>{{ t.sqlQuery }} <span class="required">*</span></label>
              <!-- Monaco Editor Container -->
              <div id="sql-editor" class="monaco-editor-container"></div>
            </div>
            <div class="editor-container">
              <label>{{ t.explainOutput }}</label>
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
                {{ t.tabOverview }}
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-issues' }" 
                @click="selectTab('tab-issues')"
              >
                {{ t.tabIssues }}
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-plan' }" 
                @click="selectTab('tab-plan')"
              >
                {{ t.tabPlan }}
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-indexes' }" 
                @click="selectTab('tab-indexes')"
              >
                {{ t.tabIndexes }}
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: currentTab === 'tab-optimized' }" 
                @click="selectTab('tab-optimized')"
              >
                {{ t.tabOptimized }}
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
                  <h4>{{ t.perfScore }}</h4>
                  <div class="score-display">
                    <div class="score-number">{{ results.score !== null ? results.score : '-' }}</div>
                    <div class="score-label" :style="{ color: results.scoreColor }">
                      {{ results.scoreDesc || t.scoreHelpText }}
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
                  <h4>{{ t.querySummary }}</h4>
                  <div class="summary-details" v-html="results.summaryHTML"></div>
                </div>
              </div>
              
              <div class="performance-estimates">
                <h4>{{ t.perfEstimates }}</h4>
                <div class="estimate-cards">
                  <div class="est-card">
                    <h5>{{ t.scaleSmall }}</h5>
                    <p class="est-desc">{{ results.estSmallText }}</p>
                  </div>
                  <div class="est-card">
                    <h5>{{ t.scaleMed }}</h5>
                    <p class="est-desc">{{ results.estMedText }}</p>
                  </div>
                  <div class="est-card">
                    <h5>{{ t.scaleLarge }}</h5>
                    <p class="est-desc">{{ results.estLargeText }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Issues -->
            <div v-show="currentTab === 'tab-issues'" class="tab-content">
              <div class="issues-container">
                <div v-if="results.issues.length === 0" class="placeholder-text">
                  {{ t.placeholderAnalyze }}
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
                    <strong>Kenapa memengaruhi performa / Why this affects performance:</strong> {{ issue.why }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab: Plan -->
            <div v-show="currentTab === 'tab-plan'" class="tab-content">
              <div class="plan-visualizer-container">
                <div class="plan-header-row">
                  <h4>{{ t.visualExplain }}</h4>
                  <span class="badge">{{ results.planSourceBadge }}</span>
                </div>
                
                <!-- Tree render -->
                <div class="plan-tree">
                  <div v-if="results.visualNodes.length === 0" class="placeholder-text">
                    {{ t.placeholderPlan }}
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
                  <h4>{{ t.detailedExplain }}</h4>
                  <div v-html="results.planExplainHTML"></div>
                </div>
              </div>
            </div>

            <!-- Tab: Indexes -->
            <div v-show="currentTab === 'tab-indexes'" class="tab-content">
              <div class="indexes-container">
                <div v-if="results.indexes.length === 0" class="placeholder-text">
                  {{ t.placeholderIndex }}
                </div>
                <div 
                  v-else 
                  v-for="(rec, rIdx) in results.indexes" 
                  :key="rIdx" 
                  class="index-card"
                >
                  <div class="index-card-header">
                    <h5>{{ rec.name }}</h5>
                    <span class="badge success">{{ t.recommendLabel }}</span>
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
                        <h6>{{ t.reasonLabel }}</h6>
                        <p>{{ rec.reason }}</p>
                      </div>
                      <div class="impact-subcard">
                        <h6>{{ t.impactLabel }}</h6>
                        <p>
                          <strong>{{ t.positiveLabel }}:</strong> {{ rec.positive }}<br>
                          <strong>{{ t.negativeLabel }}:</strong> {{ rec.negative }}
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
                <!-- Monaco Diff Editor Container -->
                <div id="monaco-diff-editor" class="monaco-diff-container"></div>
                
                <div class="optimization-notes mt-4">
                  <h4>{{ t.optReasons }}</h4>
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

// Browser Detection (Default Language)
const detectBrowserLanguage = () => {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || navigator.userLanguage || 'en'
    return lang.toLowerCase().startsWith('id') ? 'id' : 'en'
  }
  return 'en'
}

const currentLang = ref('en')

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

// Localization System
const translations = {
  en: {
    quickSamples: 'Quick Samples',
    dbEngine: 'Database Engine',
    directDB: 'Direct DB Connection',
    enableAuto: 'Enable Auto-Explain',
    host: 'Host',
    port: 'Port',
    user: 'Username',
    pass: 'Password',
    dbName: 'Database Name',
    connURI: 'Or Connection URI',
    aiConfig: 'AI API Configurations',
    model: 'Model',
    keyStatusOffline: 'Offline Heuristic Only',
    keyStatusConnected: 'Connected via',
    workspace: 'Workspace',
    analyzeQuery: 'Analyze Query',
    queryPlanInput: 'Query & Plan Input',
    sqlQuery: 'SQL Query',
    explainOutput: 'Execution Plan / EXPLAIN Output',
    tabOverview: 'Overview',
    tabIssues: 'Issues',
    tabPlan: 'Plan',
    tabIndexes: 'Index',
    tabOptimized: 'Optimized',
    perfScore: 'Performance Score',
    scoreDescGood: 'Excellent (Optimized)',
    scoreDescMed: 'Moderate (Needs Improvement)',
    scoreDescBad: 'Poor (High Latency Risk)',
    scoreHelpText: 'Submit query to analyze',
    querySummary: 'Query Summary',
    perfEstimates: 'Performance Estimates Based on Data Scale',
    scaleSmall: 'Small Data Scale',
    scaleMed: 'Medium Data Scale',
    scaleLarge: 'Large Data Scale',
    loadingExplain: 'Connecting to database and executing EXPLAIN...',
    loadingEngine: 'Connecting to Analysis Engine...',
    loadingAI: 'AI is dissecting your Query & Execution Plan...',
    loadingHeuristics: 'Running Offline Heuristic Analysis...',
    placeholderAnalyze: 'Analyze your query first to see performance issues.',
    placeholderPlan: 'Paste EXPLAIN/EXPLAIN ANALYZE results in the left panel to visualize execution plan tree.',
    placeholderIndex: 'Index recommendations will appear after query is analyzed.',
    placeholderNotes: 'Analyze query to see optimization reasons.',
    placeholderSummary: 'Analyze your query first.',
    placeholderNoPlan: 'No plan data.',
    pastedPlanBadge: 'Pasted Execution Plan',
    estimatePlanBadge: 'AI Estimate Only',
    heuristicPlanBadge: 'Heuristic Parsed Plan',
    noPlanProvidedBadge: 'No Plan Provided',
    reasonLabel: 'Reason',
    impactLabel: 'Positive / Negative Impact',
    positiveLabel: 'Positive',
    negativeLabel: 'Negative',
    queryAsli: 'Original Query',
    queryOptimasi: 'Optimized Query',
    recomChanges: 'Recommended Changes:',
    changesReplaceStar: 'Replace SELECT * with specific columns',
    changesAnsiJoin: 'Replace Implicit Joins with ANSI-92 JOINs',
    changesWhereFunc: 'Avoid using functions on WHERE columns',
    changesLeadingLike: 'Avoid leading wildcards in LIKE patterns',
    recommendLabel: 'Recommended',
    sqlRequired: 'Please input a SQL query first.',
    dbConnFailed: 'Database connection failed:',
    dbExplainFailed: 'Failed to fetch database explain plan:',
    visualExplain: 'Visualized Execution Plan',
    detailedExplain: 'Detailed Execution Plan Explanation',
    optReasons: 'Change Logs & Optimization Reasons'
  },
  id: {
    quickSamples: 'Sampul Cepat / Samples',
    dbEngine: 'Database Engine',
    directDB: 'Koneksi DB Langsung',
    enableAuto: 'Aktifkan Auto-Explain',
    host: 'Host',
    port: 'Port',
    user: 'Username',
    pass: 'Password',
    dbName: 'Nama Database',
    connURI: 'Or Connection URI',
    aiConfig: 'Konfigurasi AI API',
    model: 'Model',
    keyStatusOffline: 'Hanya Heuristik Offline',
    keyStatusConnected: 'Terhubung via',
    workspace: 'Workspace',
    analyzeQuery: 'Analyze Query',
    queryPlanInput: 'Input Query & Plan',
    sqlQuery: 'Query SQL',
    explainOutput: 'Execution Plan / Output EXPLAIN',
    tabOverview: 'Ringkasan',
    tabIssues: 'Masalah',
    tabPlan: 'Plan',
    tabIndexes: 'Index',
    tabOptimized: 'Optimasi',
    perfScore: 'Skor Performa',
    scoreDescGood: 'Sangat Baik (Optimized)',
    scoreDescMed: 'Sedang (Butuh Perbaikan)',
    scoreDescBad: 'Buruk (Bahaya Latensi Tinggi)',
    scoreHelpText: 'Kirim query untuk dianalisis',
    querySummary: 'Ringkasan Query',
    perfEstimates: 'Estimasi Performa Berdasarkan Skala Data',
    scaleSmall: 'Skala Data Kecil',
    scaleMed: 'Skala Data Menengah',
    scaleLarge: 'Skala Data Besar',
    loadingExplain: 'Menghubungkan ke database dan mengambil execution plan...',
    loadingEngine: 'Menghubungkan ke Engine Analisis...',
    loadingAI: 'AI sedang membedah Query & Execution Plan kamu...',
    loadingHeuristics: 'Menjalankan Analisis Heuristik Offline...',
    placeholderAnalyze: 'Analisis query kamu terlebih dahulu untuk melihat masalah performa.',
    placeholderPlan: 'Masukkan hasil EXPLAIN/EXPLAIN ANALYZE di panel kiri untuk memvisualisasikan plan.',
    placeholderIndex: 'Rekomendasi index akan muncul setelah query dianalisis.',
    placeholderNotes: 'Analisis query untuk melihat alasan optimasi.',
    placeholderSummary: 'Analisis query kamu terlebih dahulu.',
    placeholderNoPlan: 'Tidak ada data plan.',
    pastedPlanBadge: 'Hasil Copy-Paste Plan',
    estimatePlanBadge: 'Estimasi AI Saja',
    heuristicPlanBadge: 'Plan Hasil Parsing Heuristik',
    noPlanProvidedBadge: 'Tidak Ada Plan',
    reasonLabel: 'Alasan',
    impactLabel: 'Dampak Positif / Negatif',
    positiveLabel: 'Positif',
    negativeLabel: 'Negatif',
    queryAsli: 'Query Asli',
    queryOptimasi: 'Query Optimasi',
    recomChanges: 'Perubahan yang Direkomendasikan:',
    changesReplaceStar: 'Mengganti SELECT * dengan Kolom Spesifik',
    changesAnsiJoin: 'Mengganti Koma dengan ANSI-92 INNER JOIN',
    changesWhereFunc: 'Mencegah Pemakaian Fungsi pada Kolom WHERE',
    changesLeadingLike: 'Menghindari Leading Wildcard pada LIKE',
    recommendLabel: 'Direkomendasikan',
    sqlRequired: 'Silakan masukkan query SQL terlebih dahulu.',
    dbConnFailed: 'Koneksi database gagal:',
    dbExplainFailed: 'Gagal mengambil Explain Plan otomatis:',
    visualExplain: 'Visualisasi Execution Plan',
    detailedExplain: 'Penjelasan Detail Execution Plan',
    optReasons: 'Catatan Perubahan & Alasan Optimasi'
  }
}

const t = computed(() => translations[currentLang.value])

const results = reactive({
  score: null,
  scoreDesc: '',
  scoreColor: '',
  summaryHTML: '',
  estSmallText: '-',
  estMedText: '-',
  estLargeText: '-',
  issues: [],
  planSourceBadge: '',
  visualNodes: [],
  planExplainHTML: '',
  indexes: [],
  originalQuery: '-- Query asli kamu akan muncul di sini',
  optimizedQuery: '-- Query hasil optimasi akan muncul di sini',
  optimizationNotesHTML: ''
})

// Monaco Editor Instances
let sqlEditor = null
let explainEditor = null
let diffEditor = null

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
    ? `${t.value.keyStatusConnected} ${activeProvider.value === 'gemini' ? 'Gemini' : 'OpenAI'}`
    : t.value.keyStatusOffline
})

// Life Cycle Hooks
onMounted(() => {
  // Set detected language
  const savedLang = localStorage.getItem('qs_lang')
  if (savedLang) {
    currentLang.value = savedLang
  } else {
    currentLang.value = detectBrowserLanguage()
  }

  // Set placeholders based on language
  results.summaryHTML = `<p class="placeholder-text">${t.value.placeholderSummary}</p>`
  results.planExplainHTML = `<p class="placeholder-text">${t.value.placeholderNoPlan}</p>`
  results.optimizationNotesHTML = `<p class="placeholder-text">${t.value.placeholderNotes}</p>`
  results.planSourceBadge = t.value.noPlanProvidedBadge

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

    // 3. Monaco Diff Editor (ReadOnly)
    const diffContainer = document.getElementById('monaco-diff-editor')
    if (diffContainer) {
      diffEditor = window.monaco.editor.createDiffEditor(diffContainer, {
        theme: 'vs-dark',
        automaticLayout: true,
        readOnly: true,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Consolas, "JetBrains Mono", monospace'
      })
      
      updateDiffModels()
    }
  })
}

const updateDiffModels = () => {
  if (typeof window !== 'undefined' && window.monaco && diffEditor) {
    const originalModel = window.monaco.editor.createModel(results.originalQuery, 'sql')
    const modifiedModel = window.monaco.editor.createModel(results.optimizedQuery, 'sql')
    
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    })
  }
}

// Methods
const saveLanguagePreference = () => {
  localStorage.setItem('qs_lang', currentLang.value)
  // Refresh placeholders dynamically on change
  if (results.score === null) {
    results.summaryHTML = `<p class="placeholder-text">${t.value.placeholderSummary}</p>`
    results.planExplainHTML = `<p class="placeholder-text">${t.value.placeholderNoPlan}</p>`
    results.optimizationNotesHTML = `<p class="placeholder-text">${t.value.placeholderNotes}</p>`
    results.planSourceBadge = t.value.noPlanProvidedBadge
  } else {
    // Re-trigger visual badges based on language
    results.planSourceBadge = explainPlan.value.trim() 
      ? (directConnectEnabled.value ? t.value.pastedPlanBadge : t.value.pastedPlanBadge)
      : t.value.estimatePlanBadge
    updateScoreCardValues(results.score)
  }
}

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
      if (diffEditor) diffEditor.layout()
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
    alert(t.value.sqlRequired)
    return
  }

  loading.value = true
  
  // Direct Explain Connection logic (Fase 3)
  if (directConnectEnabled.value) {
    loadingText.value = t.value.loadingExplain
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
        alert(`${t.value.dbExplainFailed} ${data.message}`)
        loading.value = false
        return
      }
    } catch (e) {
      alert(`${t.value.dbConnFailed} ${e.message}`)
      loading.value = false
      return
    }
  }

  loadingText.value = t.value.loadingEngine

  const hasKey = activeProvider.value === 'gemini' 
    ? geminiKey.value.trim().length > 0 
    : openaiKey.value.trim().length > 0

  try {
    if (hasKey) {
      loadingText.value = t.value.loadingAI
      await runAIAnalysis(sql, explain, dbEngine.value)
    } else {
      loadingText.value = t.value.loadingHeuristics
      await new Promise(resolve => setTimeout(resolve, 800))
      runOfflineAnalysis(sql, explain, dbEngine.value)
    }
  } catch (error) {
    console.error(error)
    alert(`Failed to analyze: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// AI Connector Flow
const runAIAnalysis = async (sql, explain, engine) => {
  const provider = activeProvider.value
  const key = provider === 'gemini' ? geminiKey.value.trim() : openaiKey.value.trim()
  const model = provider === 'gemini' ? geminiModel.value : openaiModel.value
  const targetLanguageText = currentLang.value === 'id' ? 'Bahasa Indonesia' : 'English'

  const prompt = `Anda adalah AI SQL Performance Engineer yang ahli dalam optimasi query SQL untuk PostgreSQL, MySQL, SQL Server, SQLite, dan Oracle.
Tugas utama Anda adalah menganalisis query SQL dan memberikan rekomendasi optimasi tanpa mengubah hasil atau logika bisnis dari query tersebut.

Database Engine yang digunakan: ${engine}
Tulis laporan Anda sepenuhnya menggunakan: ${targetLanguageText}

=== SQL QUERY ===
${sql}

=== EXECUTION PLAN / EXPLAIN OUTPUT ===
${explain || 'Tidak ada execution plan yang disediakan.'}

Instruksi Output:
Analisis query tersebut dan berikan tanggapan menggunakan format markdown persis seperti berikut ini. Pastikan Anda menyertakan pembagi header '#' persis di bawah agar sistem kami dapat mem-parsing data Anda dengan benar. Jangan menambahkan pengantar meta atau penutup di luar struktur ini:

# Query Summary
[Berikan deskripsi singkat tentang tujuan query, tabel yang digunakan, dll.]

# Performance Issues
[Jelaskan masalah performa yang terdeteksi secara mendalam.]

# Execution Plan Explanation
[Jelaskan setiap node plan, estimated/actual cost, dan tipe scan.]

# Index Recommendations
[Berikan rekomendasi index. Untuk setiap index, tampilkan perintah SQL pembuatannya, alasan, dll.]
Contoh format:
\`\`\`sql
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);
\`\`\`
Alasan / Reason: ...
Dampak Positif / Positive: ...
Dampak Negatif / Negative: ...

# Query Optimization
[Berikan versi query SQL yang lebih efisien di dalam block SQL. Jelaskan alasan logis untuk setiap optimasi yang Anda buat.]

# Performance Score
[Berikan skor 1 sampai 10 dalam format 'Skor Performa: X' atau 'Performance Score: X'. Berikan penjelasan terpisah untuk performa pada Data Kecil, Data Menengah, dan Data Besar.]`

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

  const parts = mdText.split(/(?=# (?:Query Summary|Ringkasan Query|Performance Issues|Masalah Performa|Execution Plan Explanation|Penjelasan Execution Plan|Index Recommendations|Rekomendasi Index|Query Optimization|Optimasi Query|Performance Score|Skor Performa))/i)
  
  parts.forEach(part => {
    const trimmed = part.trim()
    if (trimmed.startsWith('# Query Summary') || trimmed.startsWith('# Ringkasan Query')) {
      sections.summary = trimmed.replace(/# (?:Query Summary|Ringkasan Query)/i, '').trim()
    } else if (trimmed.startsWith('# Performance Issues') || trimmed.startsWith('# Masalah Performa')) {
      sections.issues = trimmed.replace(/# (?:Performance Issues|Masalah Performa)/i, '').trim()
    } else if (trimmed.startsWith('# Execution Plan Explanation') || trimmed.startsWith('# Penjelasan Execution Plan')) {
      sections.plan = trimmed.replace(/# (?:Execution Plan Explanation|Penjelasan Execution Plan)/i, '').trim()
    } else if (trimmed.startsWith('# Index Recommendations') || trimmed.startsWith('# Rekomendasi Index')) {
      sections.indexes = trimmed.replace(/# (?:Index Recommendations|Rekomendasi Index)/i, '').trim()
    } else if (trimmed.startsWith('# Query Optimization') || trimmed.startsWith('# Optimasi Query')) {
      sections.optimized = trimmed.replace(/# (?:Query Optimization|Optimasi Query)/i, '').trim()
    } else if (trimmed.startsWith('# Performance Score') || trimmed.startsWith('# Skor Performa')) {
      sections.score = trimmed.replace(/# (?:Performance Score|Skor Performa)/i, '').trim()
    }
  })

  // Fill structure
  results.summaryHTML = formatMarkdownToHTML(sections.summary || 'No summary was generated by the AI.')
  results.issues = parseIssuesFromMarkdown(sections.issues)
  results.indexes = parseIndexesFromMarkdown(sections.indexes)
  results.originalQuery = originalSql

  // Parse Score
  let scoreNum = 5
  const scoreMatch = sections.score.match(/(?:Skor\s+Performa|Performance\s+Score):\s*(\d+)/i) || mdText.match(/(?:Skor\s+Performa|Performance\s+Score):\s*(\d+)/i)
  if (scoreMatch) {
    scoreNum = parseInt(scoreMatch[1], 10)
  }
  updateScoreCardValues(scoreNum, sections.score)

  // Plan Visualizer
  results.planSourceBadge = explain ? t.value.pastedPlanBadge : t.value.estimatePlanBadge
  if (explain) {
    results.visualNodes = parseVisualPlanNodes(explain, engine)
  } else {
    results.visualNodes = []
  }
  results.planExplainHTML = formatMarkdownToHTML(sections.plan || 'No detailed plan analysis.')

  // Optimized query extraction
  const sqlBlockRegex = /```sql([\s\S]*?)```/i
  const match = sections.optimized.match(sqlBlockRegex)
  if (match) {
    results.optimizedQuery = match[1].trim()
    const remainingNotes = sections.optimized.replace(sqlBlockRegex, '').trim()
    results.optimizationNotesHTML = formatMarkdownToHTML(remainingNotes || 'Optimized query structure.')
  } else {
    results.optimizedQuery = originalSql
    results.optimizationNotesHTML = formatMarkdownToHTML(sections.optimized || 'Optimized query structure.')
  }

  // Update diff models
  updateDiffModels()

  currentTab.value = 'tab-overview'
}

// Helpers
const updateScoreCardValues = (score, scoreText = '') => {
  results.score = score
  
  let desc = ''
  let color = ''
  if (score <= 3) {
    desc = t.value.scoreDescGood
    color = '#007acc'
  } else if (score <= 6) {
    desc = t.value.scoreDescMed
    color = '#cca700'
  } else {
    desc = t.value.scoreDescBad
    color = '#f44747'
  }
  
  results.scoreDesc = desc
  results.scoreColor = color

  if (scoreText) {
    const smallMatch = scoreText.match(/(?:Data Kecil|Small Data Scale):?\s*([^\n]+)/i) || []
    const medMatch = scoreText.match(/(?:Data Menengah|Medium Data Scale):?\s*([^\n]+)/i) || []
    const largeMatch = scoreText.match(/(?:Data Besar|Large Data Scale):?\s*([^\n]+)/i) || []

    results.estSmallText = smallMatch[1] || (score <= 3 ? (currentLang.value === 'id' ? 'Sangat cepat (< 5ms). Beban minimal.' : 'Very fast (< 5ms). Minimal load.') : (currentLang.value === 'id' ? 'Cepat (< 20ms) karena volume data kecil masih bisa tertampung memori.' : 'Fast (< 20ms) as small data fits in memory buffer.'))
    results.estMedText = medMatch[1] || (score <= 3 ? (currentLang.value === 'id' ? 'Cepat (< 50ms) berkat index.' : 'Fast (< 50ms) using indexes.') : (currentLang.value === 'id' ? 'Latensi terasa meningkat (100ms - 500ms). Full table scan mulai membebani disk.' : 'Increased latency (100ms - 500ms). Table scans start loading disks.'))
    results.estLargeText = largeMatch[1] || (score <= 3 ? (currentLang.value === 'id' ? 'Tetap stabil (< 200ms).' : 'Remains stable (< 200ms).') : (currentLang.value === 'id' ? 'Sangat lambat (> 2 detik). Resiko CPU spikes dan timeout pada database.' : 'Very slow (> 2s). High risk of CPU spikes and gateway timeouts.'))
  } else {
    results.estSmallText = score <= 3 ? (currentLang.value === 'id' ? 'Sangat cepat (< 5ms).' : 'Very fast (< 5ms).') : (currentLang.value === 'id' ? 'Cepat (< 20ms).' : 'Fast (< 20ms).')
    results.estMedText = score <= 3 ? (currentLang.value === 'id' ? 'Cepat (< 50ms).' : 'Fast (< 50ms).') : (currentLang.value === 'id' ? 'Sedang (100ms - 500ms).' : 'Moderate (100ms - 500ms).')
    results.estLargeText = score <= 3 ? (currentLang.value === 'id' ? 'Stabil (< 200ms).' : 'Stable (< 200ms).') : (currentLang.value === 'id' ? 'Lambat (> 2 detik).' : 'Slow (> 2s).')
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
      title: currentLang.value === 'id' ? 'Penggunaan SELECT *' : 'SELECT * Wildcard Usage',
      desc: currentLang.value === 'id' ? 'Mengambil semua kolom dari tabel meskipun tidak semuanya diperlukan.' : 'Fetches all columns from tables even if only some are used.',
      why: currentLang.value === 'id' ? 'SELECT * memperlambat query karena meningkatkan beban I/O jaringan, menghalangi database untuk memanfaatkan Index-Only Scan, dan mengonsumsi memori lebih besar.' : 'SELECT * increases disk/network I/O, prevents Index-Only scans, and inflates memory consumption.'
    })
    score += 2
  }

  if (/\blike\s+['"]%/.test(lowerSql)) {
    issues.push({
      severity: 'high',
      title: currentLang.value === 'id' ? 'Leading Wildcard pada Clause LIKE' : 'Leading Wildcard in LIKE Condition',
      desc: currentLang.value === 'id' ? 'Pencarian kata kunci menggunakan pattern awal persen (\'%keyword\').' : 'Keyword searches prefixing query with a percentage symbol.',
      why: currentLang.value === 'id' ? 'Penggunaan wildcard di depan kolom menghalangi database engine untuk menggunakan B-Tree index scan konvensional, sehingga memaksa database untuk melakukan Full Table Scan.' : 'Prefix wildcards bypass traditional B-Tree index scans, forcing high cost sequential full table scans.'
    })
    score += 3
  }

  const funcRegex = /\bwhere\s+(?:lower|upper|year|month|date|coalesce|concat|substring|trim)\s*\(/i
  if (funcRegex.test(lowerSql)) {
    issues.push({
      severity: 'high',
      title: currentLang.value === 'id' ? 'Fungsi Manipulasi Kolom pada Predicate WHERE' : 'Column Wrapped Functions in WHERE Clause',
      desc: currentLang.value === 'id' ? 'Membungkus nama kolom di dalam fungsi (misal: LOWER(column), YEAR(column)).' : 'Modifying column inputs using helper functions inside conditional statements.',
      why: currentLang.value === 'id' ? 'Penerapan fungsi pada kolom langsung membatalkan penggunaan index B-Tree standar pada kolom tersebut.' : 'Applying scalar functions direct to columns disables index lookups, forcing evaluation checks on every single row.'
    })
    score += 2
  }

  if (/\bfrom\s+\w+\s*,\s*\w+/.test(lowerSql) && !/\bwhere\b/.test(lowerSql)) {
    issues.push({
      severity: 'high',
      title: currentLang.value === 'id' ? 'Cartesian Join (Cross Join) Tanpa Filter' : 'Cartesian Join Without Filter Key',
      desc: currentLang.value === 'id' ? 'Menggabungkan tabel menggunakan format koma tanpa klausa join atau WHERE.' : 'Joining multiple tables via implicit comma spacing without filters.',
      why: currentLang.value === 'id' ? 'Ini akan menghasilkan Cartesian Product (M x N baris), mengonsumsi memori server secara drastis.' : 'Results in an unrestricted Cartesian Product (M x N rows), bloating query buffers and risking engine crashes.'
    })
    score += 4
  } else if (/\bfrom\s+\w+\s*,\s*\w+/.test(lowerSql)) {
    issues.push({
      severity: 'medium',
      title: currentLang.value === 'id' ? 'Implicit JOIN (Syntax ANSI-89)' : 'Implicit Comma Join (ANSI-89 Syntax)',
      desc: currentLang.value === 'id' ? 'Menggabungkan tabel di klausa FROM dengan pemisah koma.' : 'Joining databases tables via comma lists inside FROM block.',
      why: currentLang.value === 'id' ? 'Meskipun optimizer modern dapat menerjemahkannya ke INNER JOIN, penulisan ini sangat rentan terhadap kesalahan ketik.' : 'Prone to typos and missing join criteria which could escalate into an unexpected Cartesian join.'
    })
    score += 1
  }

  if (/\boffset\s+\d+/.test(lowerSql)) {
    const offsetVal = parseInt(lowerSql.match(/\boffset\s+(\d+)/)[1], 10)
    if (offsetVal > 1000) {
      issues.push({
        severity: 'medium',
        title: currentLang.value === 'id' ? 'OFFSET Terlalu Besar' : 'Extremely High Pagination OFFSET',
        desc: currentLang.value === 'id' ? `Query melompati data sebanyak ${offsetVal} baris.` : `Query skips ${offsetVal} rows.`,
        why: currentLang.value === 'id' ? 'OFFSET mengharuskan database memindai semua baris sebelumnya dan membuangnya.' : 'Database has to scan all discarded rows before reaching target offset. Recommended seek keyset paging.'
      })
      score += 2
    }
  }

  if ((lowerSql.match(/\bselect\b/g) || []).length > 2) {
    issues.push({
      severity: 'medium',
      title: currentLang.value === 'id' ? 'Subquery Bertingkat' : 'Nested Subqueries',
      desc: currentLang.value === 'id' ? 'Ditemukan beberapa subquery di dalam query utama.' : 'Identified nested subqueries in the main SQL.',
      why: currentLang.value === 'id' ? 'Subquery bertingkat dapat menyebabkan database mengeksekusi subquery secara berulang (correlated).' : 'Nested subqueries could trigger repetitive sub-evaluations. Better replaced with joins or CTEs.'
    })
    score += 1
  }

  if (/\bselect\s+distinct\b/.test(lowerSql)) {
    issues.push({
      severity: 'low',
      title: currentLang.value === 'id' ? 'Penggunaan DISTINCT' : 'Redundant DISTINCT',
      desc: currentLang.value === 'id' ? 'Menyaring baris duplikat secara eksplisit.' : 'Explicitly filters rows to ensure uniqueness.',
      why: currentLang.value === 'id' ? 'DISTINCT memaksa database melakukan sorting atau hashing tambahan untuk dedup.' : 'Forces sorting/hashing deduplication overheads. Unnecessary if uniqueness is already guaranteed by schema key constraints.'
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

  // Update diff models
  updateDiffModels()

  // Plan Visualizer
  results.planSourceBadge = explain ? t.value.heuristicPlanBadge : t.value.noPlanProvidedBadge
  if (explain) {
    results.visualNodes = parseVisualPlanNodes(explain, engine)
    results.planExplainHTML = currentLang.value === 'id' 
      ? `<p>Telah dilakukan parsing lokal terhadap <strong>${engine.toUpperCase()}</strong> execution plan yang Anda masukkan. Lihat panel visualisasi di atas untuk detail hierarki scan.</p>`
      : `<p>Locally parsed your <strong>${engine.toUpperCase()}</strong> execution plan. Check the visualized tree above for the cost hot spots.</p>`
  } else {
    results.visualNodes = []
    results.planExplainHTML = currentLang.value === 'id'
      ? `<p>Tidak ada data plan yang diinputkan. Database kemungkinan besar akan menggunakan sequential scan jika volume data besar dan index tidak tersedia pada query tersebut.</p>`
      : `<p>No execution plan details pasted. Database will likely default to sequential table scan if data grows without proper indexing.</p>`
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
    joins.push(`${match[1] ? match[1].toUpperCase() : 'INNER'} JOIN ${currentLang.value === 'id' ? 'pada' : 'on'} ${match[2]}`)
    tables.push(match[2])
  }

  const whereMatch = sql.match(/\bwhere\s+([\s\S]+?)(?:\bgroup\s+by\b|\border\s+by\b|\blimit\b|\boffset\b|$)/i)
  if (whereMatch) {
    whereConds.push(whereMatch[1].trim())
  }

  const cleanTables = [...new Set(tables)]

  return currentLang.value === 'id' 
    ? `
      <h5>Struktur Query Terdeteksi:</h5>
      <ul>
        <li><strong>Tabel Terlibat:</strong> ${cleanTables.length > 0 ? cleanTables.join(', ') : 'Tidak dapat diidentifikasi secara pasti'}</li>
        <li><strong>Metode Join:</strong> ${joins.length > 0 ? joins.join(', ') : 'Tidak menggunakan ANSI JOIN (Single Table atau Cartesian implicit)'}</li>
        <li><strong>Kondisi Filter (WHERE):</strong> <code>${whereConds.length > 0 ? whereConds[0] : 'Tidak ada filter pencarian'}</code></li>
        <li><strong>Fungsi Agregasi:</strong> ${/\b(sum|avg|count|max|min)\b/i.test(sql) ? 'Ya (Terdeteksi)' : 'Tidak terdeteksi'}</li>
      </ul>
    `
    : `
      <h5>Detected Query Structure:</h5>
      <ul>
        <li><strong>Tables Involved:</strong> ${cleanTables.length > 0 ? cleanTables.join(', ') : 'Undetermined'}</li>
        <li><strong>Join Methods:</strong> ${joins.length > 0 ? joins.join(', ') : 'No ANSI JOINs used (Implicit or single table)'}</li>
        <li><strong>Filter Conditions (WHERE):</strong> <code>${whereConds.length > 0 ? whereConds[0] : 'No filter conditions'}</code></li>
        <li><strong>Aggregation Functions:</strong> ${/\b(sum|avg|count|max|min)\b/i.test(sql) ? 'Yes (Detected)' : 'None detected'}</li>
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
        reason: currentLang.value === 'id' ? `Membantu proses JOIN dengan mempercepat pencarian data relasional pada kolom key: ${col1}.` : `Optimizes JOIN processing by indexing lookup foreign key: ${col1}.`,
        positive: currentLang.value === 'id' ? `Mengubah index scan dari Nested Loop / Hash Join Full Scan menjadi Index Lookup yang efisien.` : `Swaps sequential relation scans to high-performance index lookups.`,
        negative: currentLang.value === 'id' ? `Menambah memori penyimpanan dan sedikit menurunkan performa INSERT/UPDATE pada tabel ${table1}.` : `Increases storage overheads and slightly decreases write metrics on table ${table1}.`
      })
      addedFields.add(`${table1}_${col1}`)
    }
    if (col2 && !addedFields.has(`${table2}_${col2}`)) {
      indexRecs.push({
        name: `idx_${table2}_${col2}`,
        sql: `CREATE INDEX idx_${table2}_${col2}\nON ${table2}(${col2});`,
        reason: currentLang.value === 'id' ? `Membantu proses JOIN dengan mempercepat pencarian data relasional pada kolom key: ${col2}.` : `Optimizes JOIN processing by indexing lookup foreign key: ${col2}.`,
        positive: currentLang.value === 'id' ? `Menghindari sequential table scan pada baris relasi join.` : `Saves database engine from parsing the entire dataset.`,
        negative: currentLang.value === 'id' ? `Menambah ukuran data index di disk.` : `Occupies additional disk space.`
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
        reason: currentLang.value === 'id' ? `Mempercepat filter pencarian (equality check) pada kolom WHERE: ${col}.` : `Speeds up query equality checks on filter key: ${col}.`,
        positive: currentLang.value === 'id' ? `Database dapat langsung melompat ke baris yang dicocokkan.` : `Engine jumps directly to match rows.`,
        negative: currentLang.value === 'id' ? `Overhead tambahan saat modifikasi data.` : `Minor overheads during data writes.`
      })
      addedFields.add(`${tableGuess}_${col}`)
    }
  }

  return indexRecs
}

const parseOfflineOptimizedQuery = (sql, issues) => {
  let optimized = sql
  if (/\bselect\s+\*\b/i.test(optimized)) {
    optimized = optimized.replace(/\bselect\s+\*\b/i, currentLang.value === 'id' ? 'SELECT c.customer_id, c.first_name, o.order_id, o.order_date, o.total_amount -- Direkomendasikan mengganti * dengan kolom spesifik' : 'SELECT c.customer_id, c.first_name, o.order_id, o.order_date, o.total_amount -- Specific column fetch instead of *')
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
    optimized = optimized.replace(/\bselect\s+distinct\b/i, currentLang.value === 'id' ? 'SELECT /* Hapus DISTINCT jika key gabungan sudah dijamin unik */' : 'SELECT /* Drop DISTINCT if relation combination keys are already unique */')
  }

  return optimized
}

const parseOfflineExplanation = (issues) => {
  if (issues.length === 0) {
    return currentLang.value === 'id' 
      ? '<p>Tidak ada perubahan penting yang diidentifikasi secara otomatis oleh engine offline.</p>'
      : '<p>No optimizations were recommended by the local heuristics rules.</p>'
  }

  let html = currentLang.value === 'id' 
    ? '<h5>Perubahan yang Direkomendasikan:</h5><ul>' 
    : '<h5>Recommended Structural Improvements:</h5><ul>'
    
  issues.forEach(issue => {
    if (issue.title.includes('SELECT *') || issue.title.includes('Wildcard')) {
      html += currentLang.value === 'id'
        ? '<li><strong>Mengganti SELECT * dengan Kolom Spesifik:</strong> Mengurangi I/O disk dan jaringan, mempermudah database engine menggunakan Index-Only Scan.</li>'
        : '<li><strong>Replace SELECT * with Columns:</strong> Lowers network/disk I/O and optimizes for Index-Only Scans.</li>'
    }
    if (issue.title.includes('Implicit JOIN') || issue.title.includes('Comma Join')) {
      html += currentLang.value === 'id'
        ? '<li><strong>Mengganti Koma dengan ANSI-92 INNER JOIN:</strong> Memisahkan logika relasional (ON) dengan kriteria filter (WHERE) sehingga query lebih rapi dan mencegah resiko Cartesian Join.</li>'
        : '<li><strong>Adopt ANSI-92 JOIN syntax:</strong> Clears relational keys from search criteria constraints to avoid accidental Cartesian products.</li>'
    }
    if (issue.title.includes('Fungsi') || issue.title.includes('Function')) {
      html += currentLang.value === 'id'
        ? '<li><strong>Mencegah Pemakaian Fungsi pada Kolom WHERE:</strong> Mengubah `LOWER(c.status) = \'active\'` menjadi pencocokan langsung `c.status = \'active\'` agar index dapat terbaca oleh B-Tree.</li>'
        : '<li><strong>Eliminate column wrappers in filter matches:</strong> Replaces functions like LOWER(status) to bare keys so they map to index scans.</li>'
    }
    if (issue.title.includes('LIKE')) {
      html += currentLang.value === 'id'
        ? '<li><strong>Menghindari Leading Wildcard:</strong> Gunakan `LIKE \'keyword%\'` (trailing wildcard) jika memungkinkan, agar pencarian tidak memaksa Full Table Scan.</li>'
        : '<li><strong>Avoid Prefix Wildcards:</strong> Swaps to trailing formats (`keyword%`) where viable to allow index searches instead of complete scans.</li>'
    }
  })
  html += '</ul>'
  return html
}

// Markdown parser
const formatMarkdownToHTML = (md) => {
  if (!md) return `<p class="placeholder-text">${t.value.placeholderNoPlan}</p>`
  
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
        why: currentLang.value === 'id' ? 'Diidentifikasi oleh AI Performance Agent.' : 'Reported by the AI Performance Agent.'
      })
    }
  })

  if (parsed.length === 0) {
    parsed.push({
      severity: 'medium',
      title: 'Performance Issues',
      desc: currentLang.value === 'id' ? 'Klik tab Masalah Performa untuk membaca rincian lengkap dari AI.' : 'Click the issues tab for full detailed review.',
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
      
      const reasonMatch = block.match(/(?:Alasan|Reason):?\s*([^\n]+)/i) || []
      const impactPos = block.match(/(?:Dampak Positif|Positive):?\s*([^\n]+)/i) || []
      const impactNeg = block.match(/(?:Dampak Negatif|Negative):?\s*([^\n]+)/i) || []

      parsed.push({
        name: name,
        sql: sql,
        reason: reasonMatch[1] || (currentLang.value === 'id' ? 'Membantu filtering query.' : 'Assists database index seek filters.'),
        positive: impactPos[1] || (currentLang.value === 'id' ? 'Mempercepat lookup index.' : 'Speeds up index lookups.'),
        negative: impactNeg[1] || (currentLang.value === 'id' ? 'Overhead penulisan disk.' : 'Disk storage overheads.')
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
