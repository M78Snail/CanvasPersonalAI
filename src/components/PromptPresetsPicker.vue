<template>
  <teleport to="body">
    <div v-if="visible" class="prompt-presets-picker" :style="pickerStyle">
      <!-- 分类筛选 -->
      <div class="presets-categories">
        <div
          v-for="cat in categories"
          :key="cat"
          class="category-item"
          :class="{ active: selectedCategory === cat }"
          @mousedown.prevent
          @click.prevent="selectCategory(cat)"
        >
          {{ cat }}
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="presets-search">
        <n-input
          ref="inputRef"
          v-model:value="searchQuery"
          placeholder="搜索预置词..."
          size="small"
          clearable
          @mousedown.prevent
          @click.prevent
        />
      </div>

      <!-- 预置词列表 -->
      <div class="presets-list" v-if="filteredPresets.length > 0">
        <div
          v-for="(preset, index) in filteredPresets"
          :key="preset.id"
          class="preset-item"
          :class="{ active: index === selectedIndex }"
          @mousedown.prevent
          @click.prevent="selectPreset(preset)"
          @mouseenter="selectedIndex = index"
        >
          <div class="preset-icon">✨</div>
          <div class="preset-content">
            <div class="preset-label">{{ preset.label }}</div>
            <div class="preset-preview">{{ preset.description.slice(0, 60) }}...</div>
          </div>
        </div>
      </div>
      <div class="presets-empty" v-else>
        <span>没有匹配的预置词</span>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { NInput } from 'naive-ui'
import PROMPT_PRESETS from '@/config/promptPresets'

const props = defineProps({
  // 可见性
  visible: {
    type: Boolean,
    default: false
  },
  // 位置
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const emit = defineEmits(['update:visible', 'select'])

const inputRef = ref(null)
const searchQuery = ref('')
const selectedIndex = ref(0)
const selectedCategory = ref('全部')

// 计算弹窗样式
const pickerStyle = computed(() => ({
  position: 'fixed',
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  zIndex: 9999
}))

// 获取所有分类
const categories = computed(() => ['全部', ...new Set(PROMPT_PRESETS.map(p => p.category))])

// 过滤后的预置词列表
const filteredPresets = computed(() => {
  let result = PROMPT_PRESETS

  // 按分类过滤
  if (selectedCategory.value !== '全部') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.label.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return result
})

// 选择分类
function selectCategory(cat) {
  selectedCategory.value = cat
  selectedIndex.value = 0
}

// 监听搜索变化，重置选中索引
watch(searchQuery, () => {
  selectedIndex.value = 0
})

// 监听可见性变化，重置状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    searchQuery.value = ''
    selectedIndex.value = 0
    selectedCategory.value = '全部'
    // 添加全局键盘事件监听
    document.addEventListener('keydown', handleGlobalKeydown)
    document.addEventListener('mousedown', handleOutsideClick)
    // 聚焦搜索框
    nextTick(() => {
      inputRef.value?.focus()
    })
  } else {
    // 移除全局事件监听
    document.removeEventListener('keydown', handleGlobalKeydown)
    document.removeEventListener('mousedown', handleOutsideClick)
  }
})

// 全局键盘事件处理
function handleGlobalKeydown(event) {
  if (!props.visible) return

  if (event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
    if (filteredPresets.value[selectedIndex.value]) {
      selectPreset(filteredPresets.value[selectedIndex.value])
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closePicker()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    event.stopPropagation()
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredPresets.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  }
}

// 点击外部关闭
function handleOutsideClick(event) {
  if (!props.visible) return
  const picker = document.querySelector('.prompt-presets-picker')
  if (picker && !picker.contains(event.target)) {
    closePicker()
  }
}

// 关闭选择器
function closePicker() {
  emit('update:visible', false)
}

// 选择预置词
function selectPreset(preset) {
  emit('select', {
    id: preset.id,
    label: preset.label,
    description: preset.description
  })
  closePicker()
}
</script>

<style scoped>
.prompt-presets-picker {
  width: 320px;
  max-height: 380px;
  background: var(--card-bg, #fff);
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.presets-categories {
  display: flex;
  gap: 6px;
  padding: 10px 10px 0;
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color, #eee);
}

.category-item {
  flex-shrink: 0;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 12px;
  background: var(--bg-tertiary, #f5f5f5);
  color: var(--text-secondary, #666);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
  user-select: none;
}

.category-item:hover {
  background: var(--bg-secondary, #e8e8e8);
}

.category-item.active {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: #fff;
}

.presets-search {
  padding: 10px;
  border-bottom: 1px solid var(--border-color, #eee);
}

.presets-list {
  max-height: 240px;
  overflow-y: auto;
}

.preset-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
  user-select: none;
}

.preset-item:last-child {
  border-bottom: none;
}

.preset-item:hover,
.preset-item.active {
  background: var(--hover-bg, #f8f5ff);
}

.preset-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: linear-gradient(135deg, #a855f715, #7c3aed15);
  border-radius: 8px;
  margin-right: 10px;
  flex-shrink: 0;
}

.preset-content {
  flex: 1;
  min-width: 0;
}

.preset-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #333);
  margin-bottom: 3px;
}

.preset-preview {
  font-size: 11px;
  color: var(--text-secondary, #888);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.presets-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary, #999);
  font-size: 13px;
}
</style>
