<template>
  <div class="v-form-content">
    <div
      :class="{
        'v-form-nav': tabType == 1 ? true : false,
        'v-form-cronav': tabType == 2 ? true : false,
      }"
      v-if="showTabs"
    >
      <ul>
        <li
          v-for="(item, index) in this.cols"
          :key="index"
          :class="{ active: index == current }"
          @click="toggle(index, item)"
        >
          <a href="javascript:void(0);">{{ item.title }}</a>
        </li>
      </ul>
    </div>
    <div
      :class="{
        'v-form-wrap': true,
        ntab: showTabs == false ? true : false,
        htab: showTabs != false ? true : false,
        htab: tabType != 2 ? true : false,
        ntab: tabType == 2 ? true : false,
      }"
      ref="v-form-wrap"
    >
      <div
        class="v-form-sub"
        v-for="(item, index) in this.sectionData"
        :key="index"
      >
        <div class="v-form-wrap-title">{{ item.title }}</div>
        <div
          class="v-form-wrapContent"
          :style="{ marginTop: item.id ? '10px' : '0px' }"
        >
          <slot v-if="item.id" :name="item.id"></slot>

          <form
            v-if="item.cell"
            autocomplete="off"
            @keydown="keyDown"
            @submit="onSubmit"
          >
            <div
              v-for="(item, index) in item.cell"
              :key="index"
              :style="{ width: item.width }"
              :class="{
                'v-form-item': true,
                none: item.type == 'hidden' ? true : false,
                occ: item.type == 'blank' ? true : false,
              }"
            >
              <label
                :class="{
                  orage: item.req == 'true' ? true : false,
                  'v-form-label': true,
                }"
                :style="{ lineHeight: item.title.length > 7 ? '16px' : '34px' }"
              >
                <span v-if="item.req == 'true'">*</span
                ><span>{{ item.title }}</span>
              </label>
              <v-input
                v-if="item.type == 'text' || item.type == 'number'"
                :ref="item.field"
                :value.sync="formData[item.field]"
                :disabled.sync="item.edit"
                :inputData="item"
              ></v-input>
              <v-radio
                v-if="item.type == 'radio'"
                :ref="item.field"
                :value.sync="formData[item.field]"
                :disabled.sync="item.edit"
                :RadioData="item"
              ></v-radio>
              <v-checkbox
                v-if="item.type == 'checkbox'"
                :ref="item.field"
                :value.sync="formData[item.field]"
                :disabled.sync="item.edit"
                :CheckData="item"
              ></v-checkbox>
              <v-select
                v-if="item.type == 'select'"
                :ref="item.field"
                :value.sync="formData[item.field]"
                :disabled.sync="item.edit"
                :SelectData="item"
              >
              </v-select>
              <v-textarea
                v-if="item.type == 'textarea'"
                :ref="item.field"
                :disabled.sync="item.edit"
                :value.sync="formData[item.field]"
              ></v-textarea>
              <v-datetime
                v-if="item.type == 'datetime'"
                :ref="item.field"
                :id="item.field"
                :disabled.sync="item.edit"
                :value.sync="formData[item.field]"
              ></v-datetime>
              <v-lookup
                v-if="item.type == 'lookup'"
                :ref="item.field"
                :click="item.click"
                :id="item.field"
                :body="body"
                :disabled.sync="item.edit"
                :value.sync="formData[item.field]"
              ></v-lookup>
              <v-file
                v-if="item.type == 'file' && item.showtype == '1'"
                :fileData="item"
              ></v-file>
              <v-showfile
                v-if="item.type == 'file' && item.showtype != '1'"
                :fileData="item"
              ></v-showfile>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vRadio from "./module/radio";
import vInput from "./module/input";
import vCheckbox from "./module/checkbox";
import vSelect from "./module/select";
import vTextarea from "./module/textarea";
import vDatetime from "./module/date-time";
import vLookup from "./module/lookup";
import vFile from "./module/upload/file";
import vShowfile from "./module/upload/show-file";
import $ from "jquery";
import { ajax } from "@/utils/index";
export default {
  name: "form-item",
  data() {
    return {
      current: 0,
      sectionData: this.cols[0].section,
      formData: {},
      flagData: {},
      body: null,
    };
  },
  components: {
    vRadio,
    vCheckbox,
    vSelect,
    vTextarea,
    vDatetime,
    vLookup,
    vInput,
    vFile,
    vShowfile,
  },
  props: {
    cols: {
      type: Array,
    },
    showTabs: {
      type: Boolean,
    },
    tabType: {
      type: Number,
    },
  },
  watch: {
    formData: {
      handler(val, olval) {},
      deep: true,
    },
    sectionData: {
      handler(val, olval) {},
    },
  },
  created() {
    let data = new Array();
    let cols = this.cols;
    cols.forEach((e, i) => {
      this.bindValue(e.section, name);
    });

    // section.forEach((e) => {
    //   if (e.cell) {
    //     data.push.apply(data, e.cell);
    //   }
    // });

    // for (let k in data) {
    //   if (
    //     data[k].field &&
    //     data[k].type != "blank" &&
    //     data[k].needsave != "false"
    //   ) {
    //     this.formData[data[k].field] = "";
    //   }
    // }
    this.setsoltValue();
  },
  mounted() {
    let mode = this.getQueryString("mode");
    if (mode == 3) this.setAllDisabled(false);
    this.body = this.$refs["v-form-wrap"];
  },
  methods: {
    toggle(index, item) {
      this.current = index;
      this.sectionData = item.section;
      this.setsoltValue();

      console.log(this.formData);
      this.$nextTick(() => {
        for (let k in this.formData) {
          if (this.$refs[k] && this.$refs[k].length >= 1) {
            let ele = this.$refs[k][0];
            ele.setValue(this.formData[k]);
          }
        }
      });
    },
    keyDown() {
      if (event.keyCode == 13) return false;
    },
    onSubmit() {
      return false;
    },
    getData() {
      return this.formData;
    },
    bindValue(section, name) {
      let data = new Array();
      let arr = section;
      let obj = new Object();
      arr.forEach((e) => {
        if (e.cell) {
          data.push.apply(data, e.cell);
        }
      });
      for (let k in data) {
        if (
          data[k].field &&
          data[k].type != "blank" &&
          data[k].needsave != "false"
        ) {
          this.formData[data[k].field] = "";
        }
      }
    },
    setsoltValue() {
      this.$emit("slotValue", this.sectionData);
    },
    setValue(key, val) {
      this.$set(this.formData, key, val);
      if (this.$refs[key] && this.$refs[key].length >= 1) {
        let ele = this.$refs[key][0];
        ele.setValue(val);
      }
    },
    getQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    changeURLArg(arr) {
      let url = window.location.href;
      let newUrl = url;
      for (let k in arr) {
        let pattern = k + "=([^&]*)";
        let replaceText = k + "=" + arr[k];
        if (newUrl.match(pattern)) {
          var tmp = "/(" + k + "=)([^&]*)/gi";
          tmp = newUrl.replace(eval(tmp), replaceText);
          newUrl = tmp;
        } else {
          if (newUrl.match("[?]")) {
            newUrl = newUrl + "&" + replaceText;
          } else {
            newUrl = newUrl + "?" + replaceText;
          }
        }
      }
      return newUrl;
    },
    loadData(param, data) {
      let that = this;
      let mode = that.getQueryString("mode");
      let oid = that.getQueryString("oid");
      let url;
      if (data) url = data.url;
      else url = param.url;
      let params = {
        modelName: param.entity,
        id: oid,
        clumnName: param.key,
      };

      if (mode && mode != 1) {
        ajax.post(url, params, function (res) {
          if (res.Data) {
            that.formData = Object.assign(that.formData, res.Data);
          }
          for (let k in that.formData) {
            that.setValue(k, that.formData[k]);
          }
        });
      }
    },
    setDisabled(key, val) {
      if (this.$refs[key] && this.$refs[key].length >= 1) {
        let ele = this.$refs[key][0];
        ele.setDisabled(val);
      }
    },
    setAllDisabled(bool) {
      for (let k in this.formData) {
        if (this.$refs[k] && this.$refs[k].length >= 1) {
          let ele = this.$refs[k][0];
          ele.setDisabled(bool);
        }
      }
    },
    save(param, data) {
      let that = this;
      let mode = that.getQueryString("mode");
      let oid = that.getQueryString("oid");
      let formData, url;
      if (data) {
        formData = data.data;
        url = data.url;
      } else {
        formData = that.formData;
        url = param.url;
      }
      let params = {
        OperType: mode,
        Model: param.entity,
        key: param.key,
      };
      let fields = new Array();
      for (let k in formData) {
        let filter = {
          Name: k,
          Value: formData[k],
        };
        fields.push(filter);
      }
      params.Fields = fields;
      ajax.post(url, params, function (res) {
        if (mode == 1) {
          let url = that.changeURLArg({ mode: 2, oid: res.Data });
        }
      });
      // $.ajax({
      //   url: url,
      //   type: "post",
      //   data: params,
      //   success: function (res) {
      //     if (mode == 1) {
      //       let url = that.changeURLArg({ mode: 2, oid: res.Data });
      //     }
      //   },
      // });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
