"use client";

import { App, Button, Flex, Form, Result } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CrawlerConfigDetailHeader from "./CrawlerConfigDetailHeader";
import CrawlerConfigInfoFormCard from "./CrawlerConfigInfoFormCard";
import CrawlerPipelineCard from "./CrawlerPipelineCard";
import CrawlerStepConfig from "./CrawlerStepConfig";
import CrawlerStepFieldsDrawer from "./CrawlerStepFieldsDrawer";
import CrawlerStepLocatorsDrawer from "./CrawlerStepLocatorsDrawer";
import CrawlerStepActionsDrawer from "./CrawlerStepActionsDrawer";
import FieldFormModal from "./FieldFormModal";
import LocatorFormModal from "./LocatorFormModal";
import ActionFormModal from "./ActionFormModal";
import CreateCrawlerStepColumns from "./CrawlerStepColumns";
import {
  useAddCrawlerFieldMutation,
  useAddCrawlerStepMutation,
  useAddCrawlerStepLocatorMutation,
  useAddCrawlerStepActionMutation,
  useDeleteCrawlerFieldMutation,
  useDeleteCrawlerStepMutation,
  useDeleteCrawlerStepLocatorMutation,
  useDeleteCrawlerStepActionMutation,
  useGetCrawlerConfigDetailQuery,
  useSearchCrawlerSourcesQuery,
  useSearchCustomScriptsQuery,
  useUpdateCrawlerConfigMutation,
  useUpdateCrawlerFieldMutation,
  useUpdateCrawlerStepMutation,
  useUpdateCrawlerStepLocatorMutation,
  useUpdateCrawlerStepActionMutation,
} from "@/lib/store/apis/crawlerApi";
import { mergeParametersJson, parseParametersJson } from "@/lib/parameters";
import type {
  CrawlerConfigRequestBody,
  CrawlerCustomScriptRow,
  CrawlerFieldRequestBody,
  CrawlerFieldRow,
  CrawlerParametersPayload,
  CrawlerStepActionRequestBody,
  CrawlerStepActionRow,
  CrawlerStepLocatorRequestBody,
  CrawlerStepLocatorRow,
  CrawlerStepModel,
  CrawlerStepRequestBody,
} from "@/types/crawler";

export default function CrawlerConfigDetailPage() {
  const { message, modal } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [form] = Form.useForm();
  const [stepForm] = Form.useForm();
  const watchedStepType = Form.useWatch("stepType", stepForm);
  const watchedBrowser = Form.useWatch("browser", stepForm);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<CrawlerStepModel | null>(null);
  const [fieldsDrawerStep, setFieldsDrawerStep] =
    useState<CrawlerStepModel | null>(null);
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CrawlerFieldRow | null>(
    null,
  );

  const [locatorsDrawerStep, setLocatorsDrawerStep] =
    useState<CrawlerStepModel | null>(null);
  const [locatorModalOpen, setLocatorModalOpen] = useState(false);
  const [editingLocator, setEditingLocator] =
    useState<CrawlerStepLocatorRow | null>(null);

  const [actionsDrawerStep, setActionsDrawerStep] =
    useState<CrawlerStepModel | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [editingAction, setEditingAction] =
    useState<CrawlerStepActionRow | null>(null);

  const skip = !Number.isFinite(id) || id <= 0;

  const {
    data: detail,
    isLoading,
    isFetching,
    isError,
  } = useGetCrawlerConfigDetailQuery({ id }, { skip });

  const [updateConfig, { isLoading: saving }] =
    useUpdateCrawlerConfigMutation();
  const [addStep] = useAddCrawlerStepMutation();
  const [updateStep] = useUpdateCrawlerStepMutation();
  const [deleteStep] = useDeleteCrawlerStepMutation();
  const [addField, { isLoading: addingField }] = useAddCrawlerFieldMutation();
  const [updateField, { isLoading: updatingField }] =
    useUpdateCrawlerFieldMutation();
  const [deleteField] = useDeleteCrawlerFieldMutation();
  const [addLocator, { isLoading: addingLocator }] =
    useAddCrawlerStepLocatorMutation();
  const [updateLocator, { isLoading: updatingLocator }] =
    useUpdateCrawlerStepLocatorMutation();
  const [deleteLocator] = useDeleteCrawlerStepLocatorMutation();
  const [addAction, { isLoading: addingAction }] =
    useAddCrawlerStepActionMutation();
  const [updateAction, { isLoading: updatingAction }] =
    useUpdateCrawlerStepActionMutation();
  const [deleteAction] = useDeleteCrawlerStepActionMutation();

  const sourceSearchBody = useMemo(() => ({ page: 1, pageSize: 500 }), []);
  const { data: sourcesPage } = useSearchCrawlerSourcesQuery(sourceSearchBody);
  const sources = sourcesPage?.items ?? [];

  const scriptSearchBody = useMemo(() => ({ page: 1, pageSize: 200 }), []);
  const { data: scriptsPage } = useSearchCustomScriptsQuery(scriptSearchBody);
  const scripts: CrawlerCustomScriptRow[] = scriptsPage?.items ?? [];

  useEffect(() => {
    if (isError) {
      message.error("Không tải được chi tiết cấu hình");
    }
  }, [isError, message]);

  useEffect(() => {
    if (!detail) return;
    const paramsObj = parseParametersJson(detail.parameters) ?? {};
    const rest: Record<string, unknown> = { ...paramsObj };
    delete rest.source;
    delete rest.min_word_count;
    form.setFieldsValue({
      name: detail.name,
      sourceId: detail.sourceId ?? undefined,
      seedUrlsText: (detail.seedUrls ?? []).join("\n"),
      crawlerType: (detail.crawlerType ?? "http").toLowerCase(),
      parseType: detail.parseType ?? "HTML",
      sourceLabel: typeof paramsObj.source === "string" ? paramsObj.source : "",
      minWordCount:
        typeof paramsObj.min_word_count === "number"
          ? paramsObj.min_word_count
          : 100,
      isActive: detail.isActive ?? true,
      frequencyHours: (detail.frequencyMinutes ?? 60) / 60,
      maxDepth: detail.maxDepth ?? 3,
      maxRetry: detail.maxRetry ?? 3,
      parametersExtra: Object.keys(rest).length
        ? JSON.stringify(rest, null, 2)
        : "",
    });
  }, [detail, form]);

  const steps = useMemo(
    () =>
      [...(detail?.crawlerSteps ?? [])].sort(
        (a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0),
      ),
    [detail?.crawlerSteps],
  );

  const liveFieldsStep = useMemo(
    () =>
      fieldsDrawerStep?.id
        ? (steps.find((s) => s.id === fieldsDrawerStep.id) ?? fieldsDrawerStep)
        : fieldsDrawerStep,
    [fieldsDrawerStep, steps],
  );

  const liveLocatorsStep = useMemo(
    () =>
      locatorsDrawerStep?.id
        ? (steps.find((s) => s.id === locatorsDrawerStep.id) ??
          locatorsDrawerStep)
        : locatorsDrawerStep,
    [locatorsDrawerStep, steps],
  );

  const liveActionsStep = useMemo(
    () =>
      actionsDrawerStep?.id
        ? (steps.find((s) => s.id === actionsDrawerStep.id) ?? actionsDrawerStep)
        : actionsDrawerStep,
    [actionsDrawerStep, steps],
  );

  const saveConfig = async () => {
    const v = await form.validateFields();
    const seedUrls = String(stepRequest.seedUrlsText || "")
      .split(/[\n,]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    const payload: CrawlerParametersPayload = {};
    if (stepRequest.sourceLabel?.trim()) {
      payload.source = stepRequest.sourceLabel.trim();
    }
    if (stepRequest.minWordCount != null && stepRequest.minWordCount >= 0) {
      payload.min_word_count = Number(stepRequest.minWordCount);
    }
    let parameters = mergeParametersJson(undefined, payload);
    if (stepRequest.parametersExtra?.trim()) {
      try {
        const extra = JSON.parse(stepRequest.parametersExtra) as Record<
          string,
          unknown
        >;
        parameters = JSON.stringify({
          ...JSON.parse(parameters),
          ...extra,
        });
      } catch {
        message.warning("JSON tham số bổ sung không hợp lệ");
        return;
      }
    }
    const body: CrawlerConfigRequestBody = {
      sourceId: stepRequest.sourceId ?? null,
      name: stepRequest.name,
      crawlerType: stepRequest.crawlerType,
      parseType: stepRequest.parseType,
      seedUrls,
      isActive: stepRequest.isActive,
      frequencyMinutes: Math.max(
        1,
        Math.round(Number(stepRequest.frequencyHours) * 60),
      ),
      maxDepth: stepRequest.maxDepth,
      maxRetry: stepRequest.maxRetry,
      parameters,
    };
    try {
      await updateConfig({ id, body }).unwrap();
      message.success("Đã lưu cấu hình");
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu thất bại");
    }
  };

  const openStepForm = (step?: CrawlerStepModel) => {
    const nextOrder =
      steps.reduce((m, s) => Math.max(m, s.stepOrder ?? 0), 0) + 1;
    const target: CrawlerStepModel = step ?? {
      stepOrder: nextOrder,
      stepName: `Bước ${nextOrder}`,
      stepType: "fetch",
      requestMethod: "GET",
      delaySeconds: 0,
    };
    setEditingStep(target);
    let cfg: Record<string, unknown> = {};
    try {
      const raw =
        typeof target.extraConfig === "string"
          ? target.extraConfig
          : JSON.stringify(target.extraConfig ?? {});
      cfg = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    stepForm.resetFields();
    stepForm.setFieldsValue({
      ...target,
      stepType: (target.stepType ?? "fetch").toLowerCase(),
      extraConfigText:
        cfg && Object.keys(cfg).length > 0 ? JSON.stringify(cfg, null, 2) : "",
      browser: (cfg.browser as string) ?? "selenium",
      multiloginFolderId: (cfg.multilogin_folder_id as string) ?? "",
      multiloginProfileId: (cfg.multilogin_profile_id as string) ?? "",
      loginUrl: (cfg.login_url as string) ?? "",
      loginEmail: (cfg.login_email as string) ?? "",
      loginPassword: (cfg.login_password as string) ?? "",
      scriptGetEmailSelector: (cfg.script_get_email_selector as string) ?? "",
      scriptGetPasswordSelector: (cfg.script_get_password_selector as string) ?? "",
      scriptGetSubmitSelector: (cfg.script_get_submit_selector as string) ?? "",
    });
    setStepModalOpen(true);
  };

  const DYNAMIC_STEP_TYPES = ["interact"];

  const saveStep = async () => {
    const stepRequest = await stepForm.validateFields();
    console.log("saveStep: ", stepRequest);
    let configObj: Record<string, unknown> = {};
    if (stepRequest.extraConfigText?.trim()) {
      try {
        configObj = JSON.parse(stepRequest.extraConfigText);
      } catch {
        message.error("Cấu hình nâng cao (JSON) không hợp lệ");
        return;
      }
    }

    if (
      DYNAMIC_STEP_TYPES.includes(stepRequest.stepType) ||
      (stepRequest.isDynamic &&
        stepRequest.isDynamic === true &&
        stepRequest.stepType === "fetch")
    ) {
      if (stepRequest.browser && stepRequest.browser !== "selenium")
        configObj.browser = stepRequest.browser;
      else delete configObj.browser;

      if (stepRequest.browser === "multilogin") {
        if (stepRequest.multiloginFolderId?.trim())
          configObj.multilogin_folder_id =
            stepRequest.multiloginFolderId.trim();
        if (stepRequest.multiloginProfileId?.trim())
          configObj.multilogin_profile_id =
            stepRequest.multiloginProfileId.trim();
      } else {
        delete configObj.multilogin_folder_id;
        delete configObj.multilogin_profile_id;
      }
    } else {
      delete configObj.browser;
      delete configObj.multilogin_folder_id;
      delete configObj.multilogin_profile_id;
    }

    if (
      DYNAMIC_STEP_TYPES.includes(stepRequest.stepType) ||
      (stepRequest.isDynamic &&
        stepRequest.isDynamic === true &&
        stepRequest.stepType === "fetch")
    ) {
      if (stepRequest.loginUrl?.trim())
        configObj.login_url = stepRequest.loginUrl.trim();
      else delete configObj.login_url;
      if (stepRequest.loginEmail?.trim())
        configObj.login_email = stepRequest.loginEmail.trim();
      else delete configObj.login_email;
      if (stepRequest.loginPassword?.trim())
        configObj.login_password = stepRequest.loginPassword.trim();
      else delete configObj.login_password;
      if (stepRequest.scriptGetEmailSelector?.trim())
        configObj.script_get_email_selector = stepRequest.scriptGetEmailSelector.trim();
      else delete configObj.script_get_email_selector;
      if (stepRequest.scriptGetPasswordSelector?.trim())
        configObj.script_get_password_selector = stepRequest.scriptGetPasswordSelector.trim();
      else delete configObj.script_get_password_selector;
      if (stepRequest.scriptGetSubmitSelector?.trim())
        configObj.script_get_submit_selector = stepRequest.scriptGetSubmitSelector.trim();
      else delete configObj.script_get_submit_selector;
    } else {
      delete configObj.login_url;
      delete configObj.login_email;
      delete configObj.login_password;
      delete configObj.script_get_email_selector;
      delete configObj.script_get_password_selector;
      delete configObj.script_get_submit_selector;
    }

    const extraConfig: string | undefined =
      Object.keys(configObj).length > 0 ? JSON.stringify(configObj) : undefined;

    const base: CrawlerStepRequestBody = {
      crawlerConfigId: id,
      isDynamic: stepRequest.isDynamic,
      filterRegex: stepRequest.filterRegex,
      stepOrder: stepRequest.stepOrder,
      stepName: stepRequest.stepName,
      stepType: stepRequest.stepType ?? "fetch",
      requestMethod: stepRequest.requestMethod ?? "GET",
      outputUrlType: stepRequest.outputUrlType ?? "none",
      delaySeconds: stepRequest.delaySeconds ?? 0,
      customScriptId: stepRequest.customScriptId ?? null,
      extraConfig: extraConfig ?? undefined,
    };
    try {
      if (editingStep?.id) {
        await updateStep({ id: editingStep.id, body: base }).unwrap();
      } else {
        await addStep(base).unwrap();
      }
      message.success("Đã lưu bước");
      setStepModalOpen(false);
      setEditingStep(null);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu bước thất bại");
    }
  };

  const openFieldsDrawer = (s: CrawlerStepModel) => {
    setFieldsDrawerStep(s);
  };

  const openAddField = () => {
    setEditingField(null);
    setFieldModalOpen(true);
  };

  const openEditField = (f: CrawlerFieldRow) => {
    setEditingField(f);
    setFieldModalOpen(true);
  };

  const saveField = async (body: CrawlerFieldRequestBody) => {
    if (!liveFieldsStep?.id) {
      message.error("Bước chưa có id — lưu pipeline trước");
      return;
    }
    try {
      if (editingField?.id) {
        await updateField({
          id: editingField.id,
          body,
          crawlerConfigId: id,
        }).unwrap();
        message.success("Đã cập nhật field");
      } else {
        await addField({ body, crawlerConfigId: id }).unwrap();
        message.success("Đã thêm field");
      }
      setFieldModalOpen(false);
      setEditingField(null);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu field thất bại");
    }
  };

  const removeField = (f: CrawlerFieldRow) => {
    if (!f.id) return;
    modal.confirm({
      title: "Xóa field?",
      content: f.fieldName,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteField({ id: f.id!, crawlerConfigId: id }).unwrap();
          message.success("Đã xóa field");
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const removeStep = (s: CrawlerStepModel) => {
    if (!s.id) return;
    modal.confirm({
      title: "Xóa bước?",
      content: s.stepName,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteStep({ id: s.id!, crawlerConfigId: id }).unwrap();
          message.success("Đã xóa");
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const openLocatorsDrawer = (s: CrawlerStepModel) => {
    setLocatorsDrawerStep(s);
  };

  const openAddLocator = () => {
    setEditingLocator(null);
    setLocatorModalOpen(true);
  };

  const openEditLocator = (loc: CrawlerStepLocatorRow) => {
    setEditingLocator(loc);
    setLocatorModalOpen(true);
  };

  const saveLocator = async (body: CrawlerStepLocatorRequestBody) => {
    if (!liveLocatorsStep?.id) return;
    try {
      if (editingLocator?.id) {
        await updateLocator({
          id: editingLocator.id,
          body,
          crawlerConfigId: id,
        }).unwrap();
        message.success("Đã cập nhật locator");
      } else {
        await addLocator({ body, crawlerConfigId: id }).unwrap();
        message.success("Đã thêm locator");
      }
      setLocatorModalOpen(false);
      setEditingLocator(null);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu locator thất bại");
    }
  };

  const openActionsDrawer = (s: CrawlerStepModel) => {
    setActionsDrawerStep(s);
  };

  const openAddAction = () => {
    setEditingAction(null);
    setActionModalOpen(true);
  };

  const openEditAction = (a: CrawlerStepActionRow) => {
    setEditingAction(a);
    setActionModalOpen(true);
  };

  const saveAction = async (body: CrawlerStepActionRequestBody) => {
    if (!liveActionsStep?.id) return;
    try {
      if (editingAction?.id) {
        await updateAction({ id: editingAction.id, body, crawlerConfigId: id }).unwrap();
        message.success("Đã cập nhật action");
      } else {
        await addAction({ body, crawlerConfigId: id }).unwrap();
        message.success("Đã thêm action");
      }
      setActionModalOpen(false);
      setEditingAction(null);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Lưu action thất bại");
    }
  };

  const removeAction = (a: CrawlerStepActionRow) => {
    if (!a.id) return;
    modal.confirm({
      title: "Xóa action?",
      content: `${a.actionType}${a.locatorValue ? ` — ${a.locatorValue}` : ""}`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteAction({ id: a.id!, crawlerConfigId: id }).unwrap();
          message.success("Đã xóa action");
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const removeLocator = (loc: CrawlerStepLocatorRow) => {
    if (!loc.id) return;
    modal.confirm({
      title: "Xóa locator?",
      content: `${loc.locatorType}: ${loc.locatorValue}`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteLocator({ id: loc.id!, crawlerConfigId: id }).unwrap();
          message.success("Đã xóa locator");
        } catch (e) {
          message.error(e instanceof Error ? e.message : "Xóa thất bại");
        }
      },
    });
  };

  const stepColumns = CreateCrawlerStepColumns({
    onOpenLocators: openLocatorsDrawer,
    onOpenFields: openFieldsDrawer,
    onOpenActions: openActionsDrawer,
    onEditStep: openStepForm,
    onRemoveStep: removeStep,
  });

  const tableBusy = isLoading || isFetching;

  if (!Number.isFinite(id)) {
    return (
      <Result
        status="error"
        title="ID không hợp lệ"
        subTitle="Quay lại danh sách để chọn cấu hình."
        extra={
          <Button type="primary" onClick={() => router.push("/crawler/config")}>
            Về danh sách
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Flex vertical gap="large" style={{ width: "100%" }}>
        <CrawlerConfigDetailHeader
          title={detail?.name ?? "Chi tiết cấu hình"}
          isActive={detail?.isActive}
          showStatusTag={!!detail}
          onBack={() => router.push("/crawler/config")}
        />

        <CrawlerConfigInfoFormCard
          form={form}
          sources={sources}
          loading={tableBusy && !detail}
          saving={saving}
          onSave={saveConfig}
        />

        <CrawlerPipelineCard
          steps={steps}
          loading={tableBusy}
          columns={stepColumns}
          onAddStep={() => openStepForm()}
        />

        <CrawlerStepConfig
          stepModalOpen={stepModalOpen}
          stepForm={stepForm}
          watchedStepType={watchedStepType}
          watchedBrowser={watchedBrowser}
          scripts={scripts}
          onCancelStepModal={() => {
            setStepModalOpen(false);
            setEditingStep(null);
          }}
          onSaveStep={saveStep}
        />
      </Flex>

      <CrawlerStepFieldsDrawer
        open={!!fieldsDrawerStep}
        step={liveFieldsStep}
        onClose={() => {
          setFieldsDrawerStep(null);
          setEditingField(null);
          setFieldModalOpen(false);
        }}
        onAddField={openAddField}
        onEditField={openEditField}
        onRemoveField={removeField}
      />

      <FieldFormModal
        open={fieldModalOpen && !!liveFieldsStep?.id}
        title={editingField?.id ? "Sửa field" : "Thêm trường"}
        confirmLoading={addingField || updatingField}
        crawlerStepId={liveFieldsStep?.id ?? 0}
        initial={editingField}
        onCancel={() => {
          setFieldModalOpen(false);
          setEditingField(null);
        }}
        onSubmit={saveField}
      />

      <CrawlerStepLocatorsDrawer
        open={!!locatorsDrawerStep}
        step={liveLocatorsStep}
        onClose={() => {
          setLocatorsDrawerStep(null);
          setEditingLocator(null);
          setLocatorModalOpen(false);
        }}
        onAddLocator={openAddLocator}
        onEditLocator={openEditLocator}
        onRemoveLocator={removeLocator}
      />

      <LocatorFormModal
        open={locatorModalOpen && !!liveLocatorsStep?.id}
        title={editingLocator?.id ? "Sửa locator" : "Thêm locator"}
        confirmLoading={addingLocator || updatingLocator}
        crawlerStepId={liveLocatorsStep?.id ?? 0}
        initial={editingLocator}
        onCancel={() => {
          setLocatorModalOpen(false);
          setEditingLocator(null);
        }}
        onSubmit={saveLocator}
      />

      <CrawlerStepActionsDrawer
        open={!!actionsDrawerStep}
        step={liveActionsStep}
        onClose={() => {
          setActionsDrawerStep(null);
          setEditingAction(null);
          setActionModalOpen(false);
        }}
        onAddAction={openAddAction}
        onEditAction={openEditAction}
        onRemoveAction={removeAction}
      />

      <ActionFormModal
        open={actionModalOpen && !!liveActionsStep?.id}
        title={editingAction?.id ? "Sửa action" : "Thêm action"}
        confirmLoading={addingAction || updatingAction}
        crawlerStepId={liveActionsStep?.id ?? 0}
        initial={editingAction}
        onCancel={() => {
          setActionModalOpen(false);
          setEditingAction(null);
        }}
        onSubmit={saveAction}
      />
    </>
  );
}
